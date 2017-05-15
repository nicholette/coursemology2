# frozen_string_literal: true
module CourseUser::AchievementsConcern
  # Order achievements based on when each course_user obtained the achievement.
  def ordered_by_date_obtained
    order('course_user_achievements.obtained_at DESC')
  end
end
