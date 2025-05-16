from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from typing import Optional
from models import UserCreate, UserLogin, TaskCreate, Task, User
from auth import create_access_token, get_current_user
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TaskFlow API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.taskflow

@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# User routes
@app.post("/users/register", response_model=User)
async def register_user(user: UserCreate):
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user.password)
    del user_dict["password"]
    
    result = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return created_user

@app.post("/users/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(db_user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

# Task routes
@app.get("/tasks", response_model=list[Task])
async def get_tasks(current_user: User = Depends(get_current_user)):
    tasks = await db.tasks.find({"user_id": str(current_user["_id"])}).to_list(None)
    return tasks

@app.post("/tasks", response_model=Task)
async def create_task(task: TaskCreate, current_user: User = Depends(get_current_user)):
    task_dict = task.dict()
    task_dict["user_id"] = str(current_user["_id"])
    task_dict["created_at"] = datetime.utcnow()
    
    result = await db.tasks.insert_one(task_dict)
    created_task = await db.tasks.find_one({"_id": result.inserted_id})
    return created_task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task: TaskCreate, current_user: User = Depends(get_current_user)):
    existing_task = await db.tasks.find_one({"_id": task_id, "user_id": str(current_user["_id"])})
    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    updated_task = await db.tasks.find_one_and_update(
        {"_id": task_id},
        {"$set": task.dict()},
        return_document=True
    )
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user: User = Depends(get_current_user)):
    result = await db.tasks.delete_one({"_id": task_id, "user_id": str(current_user["_id"])})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"} 