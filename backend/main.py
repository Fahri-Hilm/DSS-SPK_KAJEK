from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import pandas as pd
import numpy as np
import os
import json
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from jose import JWTError, jwt

app = FastAPI(title="SPK Kajek API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "TOPSIS_Input_Level.xlsx"
CSV_FILE = "No-Vendor-NamaPaketPlan-CPU-RAM-DiskIOSpeed-HargaBulanUSD.csv"
HISTORY_FILE = "calculation_history.json"
USERS_FILE = "users.json"

# JWT Configuration
SECRET_KEY = "your-secret-key-here-change-in-production-09f26e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Security
security = HTTPBearer()

class WeightRequest(BaseModel):
    cpu: float
    ram: float
    disk: float
    price: float

class VendorData(BaseModel):
    vendor: str
    nama_paket: str
    cpu_level: int
    ram_level: int
    diskio_level: int
    price_level: int

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserProfile(BaseModel):
    username: str
    email: str
    display_name: str

class UpdateProfile(BaseModel):
    email: str
    display_name: str

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

# ==================== AUTH UTILITIES ====================

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2 with SHA-256"""
    # Generate a random salt
    salt = secrets.token_hex(16)
    # Hash the password with the salt
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    # Return salt and hash combined
    return f"{salt}${pwd_hash.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    try:
        salt, pwd_hash = hashed_password.split('$')
        # Hash the provided password with the same salt
        new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
        # Compare hashes
        return new_hash.hex() == pwd_hash
    except Exception:
        return False


def load_users():
    """Load users from JSON file"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    # Create default admin user if file doesn't exist
    default_users = {
        "admin": {
            "username": "admin",
            "password": hash_password("admin123"),
            "email": "admin@spk-kajek.com",
            "display_name": "Administrator"
        }
    }
    save_users(default_users)
    return default_users

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        
        users = load_users()
        if username not in users:
            raise credentials_exception
        
        return users[username]
    except JWTError:
        raise credentials_exception

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/login", response_model=Token)
def login(login_data: LoginRequest):
    """Authenticate user and return JWT token"""
    users = load_users()
    
    # Check if user exists
    if login_data.username not in users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    user = users[login_data.username]
    
    # Verify password
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["username"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "email": user["email"],
            "display_name": user["display_name"]
        }
    }

@app.get("/api/profile", response_model=UserProfile)
def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "username": current_user["username"],
        "email": current_user["email"],
        "display_name": current_user["display_name"]
    }

@app.put("/api/profile")
def update_profile(profile: UpdateProfile, current_user: dict = Depends(get_current_user)):
    """Update user profile"""
    users = load_users()
    username = current_user["username"]
    
    # Update user data
    users[username]["email"] = profile.email
    users[username]["display_name"] = profile.display_name
    
    # Save changes
    save_users(users)
    
    return {
        "message": "Profile updated successfully",
        "user": {
            "username": username,
            "email": profile.email,
            "display_name": profile.display_name
        }
    }

@app.post("/api/change-password")
def change_password(password_data: ChangePassword, current_user: dict = Depends(get_current_user)):
    """Change user password"""
    users = load_users()
    username = current_user["username"]
    
    # Verify old password
    if not verify_password(password_data.old_password, users[username]["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password is incorrect"
        )
    
    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters"
        )
    
    # Update password
    users[username]["password"] = hash_password(password_data.new_password)
    
    # Save changes
    save_users(users)
    
    return {"message": "Password changed successfully"}

@app.get("/")
def read_root():
    return {"message": "SPK Kajek API is running"}

@app.get("/api/data")
def get_data():
    try:
        # Prefer Excel as it seems to be the source of truth in the original dashboard
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        # Convert NaN to None for JSON compatibility
        return df.fillna("").to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/data")
def add_vendor(vendor: VendorData):
    try:
        # Read existing data
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        # Create new row
        new_no = len(df) + 1
        new_row = pd.DataFrame([{
            'No': new_no,
            'Vendor': vendor.vendor,
            'Nama Paket (Plan)': vendor.nama_paket,
            'CPU_Level': vendor.cpu_level,
            'RAM_Level': vendor.ram_level,
            'DiskIO_Level': vendor.diskio_level,
            'Price_Level': vendor.price_level
        }])
        
        # Append new row
        df = pd.concat([df, new_row], ignore_index=True)
        
        # Save back to Excel (create new sheet or overwrite)
        with pd.ExcelWriter(DATA_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            # Write with header rows
            df_to_save = df.copy()
            df_to_save.to_excel(writer, sheet_name='1. Input Level', index=False, startrow=2)
        
        return {"message": "Vendor added successfully", "no": new_no}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/data/{vendor_no}")
def delete_vendor(vendor_no: int):
    try:
        # Read existing data
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        # Find and remove the vendor
        df = df[df['No'] != vendor_no]
        
        # Re-number
        df['No'] = range(1, len(df) + 1)
        
        # Save back to Excel
        with pd.ExcelWriter(DATA_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            df.to_excel(writer, sheet_name='1. Input Level', index=False, startrow=2)
        
        return {"message": "Vendor deleted successfully"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/data/{vendor_no}")
def update_vendor(vendor_no: int, vendor: VendorData):
    """Update an existing vendor"""
    try:
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        # Find the vendor and update
        mask = df['No'] == vendor_no
        if not mask.any():
            raise HTTPException(status_code=404, detail="Vendor not found")
        
        df.loc[mask, 'Vendor'] = vendor.vendor
        df.loc[mask, 'Nama Paket (Plan)'] = vendor.nama_paket
        df.loc[mask, 'CPU_Level'] = vendor.cpu_level
        df.loc[mask, 'RAM_Level'] = vendor.ram_level
        df.loc[mask, 'DiskIO_Level'] = vendor.diskio_level
        df.loc[mask, 'Price_Level'] = vendor.price_level
        
        # Save back to Excel
        with pd.ExcelWriter(DATA_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            df.to_excel(writer, sheet_name='1. Input Level', index=False, startrow=2)
        
        return {"message": "Vendor updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calculate")
def calculate_topsis(weights: WeightRequest):
    try:
        # Load data from Excel
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        # Convert levels to actual values
        df['CPU_val'] = df['CPU_Level'].apply(lambda x: {1:2, 2:4, 3:6, 4:8, 5:10}[int(x)])
        df['RAM_val'] = df['RAM_Level'].apply(lambda x: {1:2, 2:4, 3:8, 4:16, 5:32}[int(x)])
        df['DiskIO_val'] = df['DiskIO_Level'].apply(lambda x: {1:150, 2:300, 3:500, 4:700, 5:1000}[int(x)])
        df['Price_val'] = df['Price_Level'].apply(lambda x: {1:15, 2:35, 3:75, 4:150, 5:250}[int(x)])
        
        # TOPSIS Calculation
        w = np.array([weights.cpu, weights.ram, weights.disk, weights.price])
        X = df[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
        
        # Normalization
        X_norm = X / np.sqrt((X**2).sum(axis=0))
        
        # Weighted matrix
        X_weighted = X_norm * w
        
        # Ideal solutions (CPU, RAM, DiskIO are BENEFIT, Price is COST)
        ideal_pos = np.array([X_weighted[:, 0].max(), X_weighted[:, 1].max(), 
                              X_weighted[:, 2].max(), X_weighted[:, 3].min()])
        ideal_neg = np.array([X_weighted[:, 0].min(), X_weighted[:, 1].min(), 
                              X_weighted[:, 2].min(), X_weighted[:, 3].max()])
        
        # Euclidean distance
        D_pos = np.sqrt(((X_weighted - ideal_pos)**2).sum(axis=1))
        D_neg = np.sqrt(((X_weighted - ideal_neg)**2).sum(axis=1))
        
        # TOPSIS Score
        df['Score'] = D_neg / (D_pos + D_neg)
        df['Rank'] = df['Score'].rank(ascending=False).astype(int)
        df['D_pos'] = D_pos
        df['D_neg'] = D_neg
        
        # Sort by rank
        result = df.sort_values('Rank')
        
        # Prepare response
        rankings = result[['Rank', 'Vendor', 'Nama Paket (Plan)', 
                          'CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val', 
                          'Score', 'D_pos', 'D_neg']].to_dict(orient='records')
        
        top = result.iloc[0]
        
        return {
            "rankings": rankings,
            "top_recommendation": {
                "Vendor": top['Vendor'],
                "Nama Paket (Plan)": top['Nama Paket (Plan)'],
                "CPU_val": int(top['CPU_val']),
                "RAM_val": int(top['RAM_val']),
                "DiskIO_val": int(top['DiskIO_val']),
                "Price_val": int(top['Price_val']),
                "Score": float(top['Score']),
                "Rank": int(top['Rank'])
            },
            "matrix": {
                "ideal_pos": ideal_pos.tolist(),
                "ideal_neg": ideal_neg.tolist()
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/calculate-detail")
def calculate_topsis_detail(weights: WeightRequest):
    """Return detailed calculation matrices for the Perhitungan view"""
    try:
        # Load data from Excel
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        # Convert levels to actual values
        cpu_map = {1:2, 2:4, 3:6, 4:8, 5:10}
        ram_map = {1:2, 2:4, 3:8, 4:16, 5:32}
        disk_map = {1:150, 2:300, 3:500, 4:700, 5:1000}
        price_map = {1:15, 2:35, 3:75, 4:150, 5:250}
        
        df['CPU_val'] = df['CPU_Level'].apply(lambda x: cpu_map[int(x)])
        df['RAM_val'] = df['RAM_Level'].apply(lambda x: ram_map[int(x)])
        df['DiskIO_val'] = df['DiskIO_Level'].apply(lambda x: disk_map[int(x)])
        df['Price_val'] = df['Price_Level'].apply(lambda x: price_map[int(x)])
        
        # Step 1: Decision Matrix (X)
        X = df[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
        
        # Step 2: Normalization - rij = xij / sqrt(sum(xij^2))
        col_sums_sq = np.sqrt((X**2).sum(axis=0))
        X_norm = X / col_sums_sq
        
        # Step 3: Weighted Normalization - yij = wj * rij
        w = np.array([weights.cpu, weights.ram, weights.disk, weights.price])
        X_weighted = X_norm * w
        
        # Step 4: Ideal Solutions
        # A+ (Positive Ideal): Max for BENEFIT, Min for COST
        # A- (Negative Ideal): Min for BENEFIT, Max for COST
        ideal_pos = np.array([X_weighted[:, 0].max(), X_weighted[:, 1].max(), 
                              X_weighted[:, 2].max(), X_weighted[:, 3].min()])
        ideal_neg = np.array([X_weighted[:, 0].min(), X_weighted[:, 1].min(), 
                              X_weighted[:, 2].min(), X_weighted[:, 3].max()])
        
        # Step 5: Distance Calculations
        D_pos = np.sqrt(((X_weighted - ideal_pos)**2).sum(axis=1))
        D_neg = np.sqrt(((X_weighted - ideal_neg)**2).sum(axis=1))
        
        # Step 6: TOPSIS Score
        scores = D_neg / (D_pos + D_neg)
        ranks = pd.Series(scores).rank(ascending=False).astype(int).tolist()
        
        # Prepare response with all matrices
        vendors = df['Vendor'].tolist()
        
        return {
            "weights": {
                "cpu": weights.cpu,
                "ram": weights.ram,
                "disk": weights.disk,
                "price": weights.price
            },
            "criteria": {
                "names": ["CPU", "RAM", "Disk I/O", "Harga"],
                "types": ["BENEFIT", "BENEFIT", "BENEFIT", "COST"]
            },
            "formulas": {
                "normalization": "rij = xij / √(Σxij²)",
                "weighted": "yij = wj × rij",
                "distance_pos": "D+ = √(Σ(yij - A+)²)",
                "distance_neg": "D- = √(Σ(yij - A-)²)",
                "score": "Score = D- / (D+ + D-)"
            },
            "step1_input": {
                "title": "1. Matriks Keputusan (X)",
                "description": "Nilai kriteria untuk setiap alternatif (konversi dari Level)",
                "vendors": vendors,
                "data": X.tolist(),
                "col_names": ["CPU", "RAM", "Disk I/O", "Harga"]
            },
            "step2_normalized": {
                "title": "2. Matriks Ternormalisasi (R)",
                "description": "Rumus: rij = xij / √(Σxij²)",
                "vendors": vendors,
                "data": np.round(X_norm, 6).tolist(),
                "divisors": np.round(col_sums_sq, 4).tolist()
            },
            "step3_weighted": {
                "title": "3. Matriks Terbobot (Y)",
                "description": "Rumus: yij = wj × rij",
                "vendors": vendors,
                "data": np.round(X_weighted, 6).tolist()
            },
            "step4_ideal": {
                "title": "4. Solusi Ideal",
                "description": "A+ (Ideal Positif): Max untuk BENEFIT, Min untuk COST | A- (Ideal Negatif): sebaliknya",
                "ideal_pos": np.round(ideal_pos, 6).tolist(),
                "ideal_neg": np.round(ideal_neg, 6).tolist()
            },
            "step5_distance": {
                "title": "5. Jarak ke Solusi Ideal",
                "description": "D+ = Jarak ke A+ | D- = Jarak ke A-",
                "vendors": vendors,
                "d_pos": np.round(D_pos, 6).tolist(),
                "d_neg": np.round(D_neg, 6).tolist()
            },
            "step6_score": {
                "title": "6. Hasil Akhir TOPSIS",
                "description": "Score = D- / (D+ + D-) | Range: 0-1 (semakin tinggi semakin baik)",
                "vendors": vendors,
                "scores": np.round(scores, 6).tolist(),
                "ranks": ranks
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ==================== HISTORY FUNCTIONS ====================

def load_history():
    """Load history from JSON file"""
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    return []

def save_history(history):
    """Save history to JSON file"""
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

class HistoryEntry(BaseModel):
    title: str
    description: Optional[str] = ""
    weights: WeightRequest
    tags: Optional[List[str]] = []
    
@app.get("/api/history")
def get_history():
    """Get all calculation history"""
    try:
        history = load_history()
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/history")
def save_calculation(entry: HistoryEntry):
    """Save a calculation to history"""
    try:
        # Load existing history
        history = load_history()
        
        # Perform TOPSIS calculation
        df = pd.read_excel(DATA_FILE, sheet_name='1. Input Level', skiprows=2)
        df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
        df = df.dropna(subset=['Vendor']).reset_index(drop=True)
        
        cpu_map = {1:2, 2:4, 3:6, 4:8, 5:10}
        ram_map = {1:2, 2:4, 3:8, 4:16, 5:32}
        disk_map = {1:150, 2:300, 3:500, 4:700, 5:1000}
        price_map = {1:15, 2:35, 3:75, 4:150, 5:250}
        
        df['CPU_val'] = df['CPU_Level'].apply(lambda x: cpu_map[int(x)])
        df['RAM_val'] = df['RAM_Level'].apply(lambda x: ram_map[int(x)])
        df['DiskIO_val'] = df['DiskIO_Level'].apply(lambda x: disk_map[int(x)])
        df['Price_val'] = df['Price_Level'].apply(lambda x: price_map[int(x)])
        
        X = df[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
        w = np.array([entry.weights.cpu, entry.weights.ram, entry.weights.disk, entry.weights.price])
        
        X_norm = X / np.sqrt((X**2).sum(axis=0))
        X_weighted = X_norm * w
        
        ideal_pos = np.array([X_weighted[:, 0].max(), X_weighted[:, 1].max(), 
                              X_weighted[:, 2].max(), X_weighted[:, 3].min()])
        ideal_neg = np.array([X_weighted[:, 0].min(), X_weighted[:, 1].min(), 
                              X_weighted[:, 2].min(), X_weighted[:, 3].max()])
        
        D_pos = np.sqrt(((X_weighted - ideal_pos)**2).sum(axis=1))
        D_neg = np.sqrt(((X_weighted - ideal_neg)**2).sum(axis=1))
        
        scores = D_neg / (D_pos + D_neg)
        df['Score'] = scores
        df['Rank'] = df['Score'].rank(ascending=False).astype(int)
        
        result = df.sort_values('Rank')
        top = result.iloc[0]
        
        # Create history entry
        history_entry = {
            "id": len(history) + 1,
            "timestamp": datetime.now().isoformat(),
            "title": entry.title,
            "description": entry.description,
            "tags": entry.tags,
            "weights": {
                "cpu": entry.weights.cpu,
                "ram": entry.weights.ram,
                "disk": entry.weights.disk,
                "price": entry.weights.price
            },
            "total_alternatives": len(df),
            "top_vendor": top['Vendor'],
            "top_score": round(float(top['Score']), 4),
            "rankings": result[['Rank', 'Vendor', 'Nama Paket (Plan)', 'Score']].head(5).to_dict(orient='records')
        }
        
        # Add to history (newest first)
        history.insert(0, history_entry)
        
        # Keep only last 50 entries
        history = history[:50]
        
        # Save
        save_history(history)
        
        return {"message": "Calculation saved to history", "id": history_entry["id"]}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/history/{history_id}")
def delete_history(history_id: int):
    """Delete a history entry"""
    try:
        history = load_history()
        history = [h for h in history if h["id"] != history_id]
        save_history(history)
        return {"message": "History entry deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/history")
def clear_history():
    """Clear all history"""
    try:
        save_history([])
        return {"message": "All history cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
