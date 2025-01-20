from enum import Enum


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    SUPERADMIN = "SUPERADMIN"


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    BANNED = "BANNED"


class StoryStatus(str, Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    DROPPED = "DROPPED"


class CategoryType(str, Enum):
    CATEGORY = "CATEGORY"
    GENRE = "GENRE"


class ReportStatus(str, Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
