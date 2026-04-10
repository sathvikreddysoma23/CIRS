from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, time
from enum import Enum


# ─────────────────────────────────────────────
# TRANSPORTATION
# ─────────────────────────────────────────────

class BusStatus(str, Enum):
    operational = "operational"
    under_maintenance = "under_maintenance"
    out_of_service = "out_of_service"


class BusBase(BaseModel):
    bus_number: str
    route: str
    driver_name: str
    driver_contact: Optional[str] = None
    capacity: int
    status: BusStatus = BusStatus.operational
    departure_time: Optional[str] = None   # e.g. "08:00 AM"
    arrival_time: Optional[str] = None
    current_location: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        use_enum_values = True


class BusCreate(BusBase):
    pass


class BusUpdate(BaseModel):
    status: Optional[BusStatus] = None
    current_location: Optional[str] = None
    driver_name: Optional[str] = None
    driver_contact: Optional[str] = None
    notes: Optional[str] = None


class BusInDB(BusBase):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


# ─────────────────────────────────────────────
# HOUSEKEEPING
# ─────────────────────────────────────────────

class CleanlinessStatus(str, Enum):
    clean = "clean"
    needs_cleaning = "needs_cleaning"
    in_progress = "in_progress"


class HousekeepingStaffBase(BaseModel):
    name: str
    employee_id: str
    assigned_building: str
    shift: str           # e.g. "Morning 6AM-2PM"
    contact: Optional[str] = None
    is_available: bool = True


class HousekeepingStaffCreate(HousekeepingStaffBase):
    pass


class HousekeepingStaffInDB(HousekeepingStaffBase):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class BuildingCleanlinessBase(BaseModel):
    building_name: str
    floor: Optional[str] = None
    status: CleanlinessStatus = CleanlinessStatus.clean
    last_cleaned: Optional[datetime] = None
    assigned_staff_id: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        use_enum_values = True


class BuildingCleanlinessCreate(BuildingCleanlinessBase):
    pass


class BuildingCleanlinessInDB(BuildingCleanlinessBase):
    id: Optional[str] = Field(default=None, alias="_id")
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


# ─────────────────────────────────────────────
# HEALTHCARE
# ─────────────────────────────────────────────

class DoctorAvailability(str, Enum):
    available = "available"
    on_leave = "on_leave"
    busy = "busy"


class DoctorBase(BaseModel):
    name: str
    specialization: str
    contact: Optional[str] = None
    availability: DoctorAvailability = DoctorAvailability.available
    consultation_hours: Optional[str] = None   # e.g. "9AM - 1PM"
    notes: Optional[str] = None

    class Config:
        use_enum_values = True


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    availability: Optional[DoctorAvailability] = None
    consultation_hours: Optional[str] = None
    notes: Optional[str] = None


class DoctorInDB(DoctorBase):
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class MedicineBase(BaseModel):
    name: str
    category: Optional[str] = None
    quantity: int = 0
    unit: str = "tablets"        # tablets / ml / strips
    minimum_threshold: int = 10  # alert if stock below this
    expiry_date: Optional[datetime] = None
    notes: Optional[str] = None


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(BaseModel):
    quantity: Optional[int] = None
    notes: Optional[str] = None
    expiry_date: Optional[datetime] = None


class MedicineInDB(MedicineBase):
    id: Optional[str] = Field(default=None, alias="_id")
    is_low_stock: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


# ─────────────────────────────────────────────
# BUS REPORTS (DRIVER FEEDBACK)
# ─────────────────────────────────────────────

class BusCondition(str, Enum):
    good = "good"
    bad = "bad"


class BusReportBase(BaseModel):
    bus_number: str
    driver_id: str
    condition: BusCondition
    issue_description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        use_enum_values = True


class BusReportCreate(BaseModel):
    bus_number: str
    condition: BusCondition
    issue_description: Optional[str] = None


class BusReportInDB(BusReportBase):
    id: Optional[str] = Field(default=None, alias="_id")

    class Config:
        populate_by_name = True
