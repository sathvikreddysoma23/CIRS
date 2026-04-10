from fastapi import APIRouter, Depends, Query
from typing import Optional
from pydantic import BaseModel
from app.controllers import operations_controller as ops
from app.middleware.auth import require_admin_or_department, get_current_active_user
from app.models.operations import (
    BusCreate, BusUpdate,
    HousekeepingStaffCreate,
    BuildingCleanlinessCreate,
    DoctorCreate, DoctorUpdate,
    MedicineCreate, MedicineUpdate,
    BusReportCreate,
)

router = APIRouter(prefix="/operations", tags=["Operations"])


# ═══════════════════════════════════════════
# TRANSPORTATION – BUSES
# ═══════════════════════════════════════════

@router.post("/buses", summary="Add a new bus")
async def add_bus(body: BusCreate, _=Depends(require_admin_or_department)):
    return await ops.add_bus(body.model_dump())


@router.get("/buses", summary="List all buses (public view)")
async def list_buses(
    status: Optional[str] = Query(None),
    _: dict = Depends(get_current_active_user),
):
    return await ops.get_all_buses(status)


@router.get("/buses/{bus_id}", summary="Get bus details")
async def get_bus(bus_id: str, _=Depends(get_current_active_user)):
    return await ops.get_bus(bus_id)


@router.put("/buses/{bus_id}", summary="Update bus info or status")
async def update_bus(bus_id: str, body: BusUpdate, _=Depends(require_admin_or_department)):
    return await ops.update_bus(bus_id, body.model_dump())


@router.delete("/buses/{bus_id}", summary="Remove a bus")
async def delete_bus(bus_id: str, _=Depends(require_admin_or_department)):
    return await ops.delete_bus(bus_id)


# ═══════════════════════════════════════════
# HOUSEKEEPING – STAFF
# ═══════════════════════════════════════════

@router.post("/housekeeping/staff", summary="Add housekeeping staff")
async def add_staff(body: HousekeepingStaffCreate, _=Depends(require_admin_or_department)):
    return await ops.add_staff(body.model_dump())


@router.get("/housekeeping/staff", summary="List housekeeping staff")
async def list_staff(
    building: Optional[str] = Query(None),
    _=Depends(get_current_active_user),
):
    return await ops.get_all_staff(building)


@router.put("/housekeeping/staff/{staff_id}", summary="Update staff info")
async def update_staff(staff_id: str, body: dict, _=Depends(require_admin_or_department)):
    return await ops.update_staff(staff_id, body)


@router.delete("/housekeeping/staff/{staff_id}", summary="Remove a staff member")
async def delete_staff(staff_id: str, _=Depends(require_admin_or_department)):
    return await ops.delete_staff(staff_id)


# ═══════════════════════════════════════════
# HOUSEKEEPING – BUILDINGS
# ═══════════════════════════════════════════

@router.post("/housekeeping/buildings", summary="Add building cleanliness record")
async def add_building(body: BuildingCleanlinessCreate, _=Depends(require_admin_or_department)):
    return await ops.add_building(body.model_dump())


@router.get("/housekeeping/buildings", summary="List building cleanliness statuses")
async def list_buildings(
    status: Optional[str] = Query(None),
    _=Depends(get_current_active_user),
):
    return await ops.get_all_buildings(status)


@router.put("/housekeeping/buildings/{building_id}", summary="Update cleaning status")
async def update_building(building_id: str, body: dict, _=Depends(require_admin_or_department)):
    return await ops.update_building(building_id, body)


# ═══════════════════════════════════════════
# HEALTHCARE – DOCTORS
# ═══════════════════════════════════════════

@router.post("/healthcare/doctors", summary="Add a doctor record")
async def add_doctor(body: DoctorCreate, _=Depends(require_admin_or_department)):
    return await ops.add_doctor(body.model_dump())


@router.get("/healthcare/doctors", summary="List doctors and availability")
async def list_doctors(
    availability: Optional[str] = Query(None),
    _=Depends(get_current_active_user),
):
    return await ops.get_all_doctors(availability)


@router.put("/healthcare/doctors/{doctor_id}", summary="Update doctor availability")
async def update_doctor(doctor_id: str, body: DoctorUpdate, _=Depends(require_admin_or_department)):
    return await ops.update_doctor(doctor_id, body.model_dump())


@router.delete("/healthcare/doctors/{doctor_id}", summary="Remove a doctor record")
async def delete_doctor(doctor_id: str, _=Depends(require_admin_or_department)):
    return await ops.delete_doctor(doctor_id)


# ═══════════════════════════════════════════
# HEALTHCARE – MEDICINES
# ═══════════════════════════════════════════

@router.post("/healthcare/medicines", summary="Add medicine to stock")
async def add_medicine(body: MedicineCreate, _=Depends(require_admin_or_department)):
    return await ops.add_medicine(body.model_dump())


@router.get("/healthcare/medicines", summary="List medicine stock")
async def list_medicines(
    low_stock_only: bool = Query(False),
    _=Depends(get_current_active_user),
):
    return await ops.get_all_medicines(low_stock_only)


@router.put("/healthcare/medicines/{med_id}", summary="Update medicine quantity")
async def update_medicine(med_id: str, body: MedicineUpdate, _=Depends(require_admin_or_department)):
    return await ops.update_medicine(med_id, body.model_dump())


@router.delete("/healthcare/medicines/{med_id}", summary="Remove medicine record")
async def delete_medicine(med_id: str, _=Depends(require_admin_or_department)):
    return await ops.delete_medicine(med_id)


# ═══════════════════════════════════════════
# BUS REPORTS
# ═══════════════════════════════════════════

@router.post("/buses/report", summary="Submit a bus condition report")
async def submit_bus_report(body: BusReportCreate, current_user: dict = Depends(get_current_active_user)):
    data = body.model_dump()
    data["driver_id"] = current_user["sub"]
    return await ops.submit_bus_report(data)


@router.get("/buses/reports", summary="Get all bus reports")
async def list_bus_reports(bus_number: Optional[str] = Query(None), _=Depends(get_current_active_user)):
    return await ops.get_bus_reports(bus_number)
