from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class BackupResponse(BaseModel):
    message: str
    backup_path: str
    timestamp: datetime

    class Config:
        orm_mode = True


class SystemConfig(BaseModel):
    maintenance_mode: bool = False
    allow_registration: bool = True
    max_login_attempts: int = 5
    session_timeout_minutes: int = 60


class SystemBackupConfig(BaseModel):
    backup_frequency_hours: int = 24
    retain_backups_days: int = 30
    backup_path: str = "/backups"


class SystemMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    active_connections: int
    response_time_ms: float
    error_rate: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now())


class AuditLog(BaseModel):
    user_id: int
    action: str
    ip_address: str
    user_agent: str
    details: dict
    timestamp: datetime = Field(default_factory=lambda: datetime.now())

    class Config:
        from_attributes = True
