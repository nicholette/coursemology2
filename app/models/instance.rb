# frozen_string_literal: true
class Instance < ActiveRecord::Base
  DEFAULT_INSTANCE_ID = 0

  has_settings_on :settings

  class << self
    # Finds the default instance.
    #
    # @return [Instance]
    def default
      @default ||= find_by(id: DEFAULT_INSTANCE_ID)
      raise 'Unknown instance. Did you run rake db:seed?' unless @default
      @default
    end

    # Finds the given tenant by host.
    #
    # @param [String] host The host to look up. This is case insensitive, however prefixes (such
    #   as www) are not handled automatically.
    # @return [Instance]
    def find_tenant_by_host(host)
      where { lower(self.host) == lower(host) }.take
    end

    # Finds the given tenant by host, falling back to the default is none is found.
    #
    # @param [String] host The host to look up. This is case insensitive, however prefixes (such
    #   as www) are not handled automatically.
    # @return [Instance]
    def find_tenant_by_host_or_default(host)
      tenants = where do
        (lower(self.host) == lower(host)) | (id == DEFAULT_INSTANCE_ID)
      end.to_a

      tenants.find { |tenant| !tenant.default? } || tenants.first
    end
  end

  validates :host, hostname: true, if: :should_validate_host?

  # @!attribute [r] instance_users
  #   @note You are scoped by the current tenant, you might not see all.
  has_many :instance_users, dependent: :destroy
  # @!attribute [r] users
  #   @note You are scoped by the current tenant, you might not see all.
  has_many :users, through: :instance_users

  # @!attribute [r] announcements
  #   @note You are scoped by the current tenant, you might not see all.
  has_many :announcements, class_name: Instance::Announcement.name, dependent: :destroy
  # @!attribute [r] courses
  #   @note You are scoped by the current tenant, you might not see all.
  has_many :courses, dependent: :destroy

  # @!method self.order_by_id(direction = :asc)
  #   Orders the instances by ID.
  scope :order_by_id, ->(direction = :asc) { order(id: direction) }

  scope :order_by_name, ->(direction = :asc) { order(name: direction) }

  # Custom ordering. Put default instance first, followed by the others, which are ordered by name.
  # This is for listing all the instances on the index page.
  scope :order_for_display, (lambda do
    order("CASE \"id\" WHEN #{DEFAULT_INSTANCE_ID} THEN 0 ELSE 1 END").order_by_name
  end)

  # @!attribute [r] course_count
  #   The number of courses in the instance.
  calculated :course_count, (lambda do
    Course.unscoped.where { courses.instance_id == instances.id }.
      select { count('*') }
  end)

  # @!attribute [r] user_count
  #   The number of users in the instance.
  calculated :user_count, (lambda do
    InstanceUser.unscoped.where { instance_users.instance_id == instances.id }.
      select { count('*') }
  end)

  def self.use_relative_model_naming?
    true
  end

  # Checks if the current instance is the default instance.
  #
  # @return [Boolean]
  def default?
    id == DEFAULT_INSTANCE_ID
  end

  # Replace the hostname of the default instance.
  def host
    return Application.config.x.default_host if default?
    super
  end

  private

  def should_validate_host? #:nodoc:
    new_record? || changed_attributes.keys.include?('host'.freeze)
  end
end
