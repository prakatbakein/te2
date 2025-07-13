#!/usr/bin/env python3
"""
Backend Authentication System Test Suite
Tests the FastAPI authentication endpoints for the job platform
"""

import requests
import json
import sys
import time
from typing import Dict, Any

# Backend URL from frontend .env
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

class AuthenticationTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.tokens = {}
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict[Any, Any] = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_backend_health(self):
        """Test if backend is running"""
        try:
            response = self.session.get(f"{BACKEND_URL}/docs", timeout=5)
            if response.status_code == 200:
                self.log_test("Backend Health", True, "Backend is running and accessible")
                return True
            else:
                self.log_test("Backend Health", False, f"Backend returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_test("Backend Health", False, f"Cannot connect to backend: {str(e)}")
            return False
    
    def test_user_signup(self, email: str, password: str, full_name: str, role: str):
        """Test user registration"""
        test_name = f"User Signup ({role})"
        
        payload = {
            "email": email,
            "password": password,
            "full_name": full_name,
            "role": role
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/signup",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "email" in data:
                    self.tokens[email] = data["access_token"]
                    self.log_test(test_name, True, f"User {email} registered successfully")
                    return True, data
                else:
                    self.log_test(test_name, False, "Missing access_token or email in response", {"response": data})
                    return False, data
            elif response.status_code == 400:
                # User might already exist
                data = response.json()
                if "already registered" in data.get("detail", "").lower():
                    self.log_test(test_name, True, f"User {email} already exists (expected for repeated tests)")
                    return True, data
                else:
                    self.log_test(test_name, False, f"Signup failed: {data.get('detail', 'Unknown error')}", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Signup failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during signup: {str(e)}")
            return False, {"error": str(e)}
    
    def test_user_login(self, email: str, password: str):
        """Test user login"""
        test_name = f"User Login ({email})"
        
        payload = {
            "email": email,
            "password": password
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "email" in data:
                    self.tokens[email] = data["access_token"]
                    self.log_test(test_name, True, f"User {email} logged in successfully")
                    return True, data
                else:
                    self.log_test(test_name, False, "Missing access_token or email in response", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Login failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during login: {str(e)}")
            return False, {"error": str(e)}
    
    def test_token_verification(self, email: str):
        """Test /api/auth/me endpoint with JWT token"""
        test_name = f"Token Verification ({email})"
        
        if email not in self.tokens:
            self.log_test(test_name, False, f"No token available for {email}")
            return False, {}
        
        headers = {
            "Authorization": f"Bearer {self.tokens[email]}",
            "Content-Type": "application/json"
        }
        
        try:
            response = self.session.get(
                f"{API_BASE}/auth/me",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "email" in data and data["email"] == email:
                    self.log_test(test_name, True, f"Token verification successful for {email}")
                    return True, data
                else:
                    self.log_test(test_name, False, "Token verification returned wrong user data", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Token verification failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during token verification: {str(e)}")
            return False, {"error": str(e)}
    
    def test_invalid_credentials(self):
        """Test login with invalid credentials"""
        test_name = "Invalid Credentials Test"
        
        payload = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 401:
                data = response.json()
                self.log_test(test_name, True, "Invalid credentials properly rejected")
                return True, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Expected 401 but got {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during invalid credentials test: {str(e)}")
            return False, {"error": str(e)}
    
    def test_missing_token(self):
        """Test /api/auth/me without token"""
        test_name = "Missing Token Test"
        
        try:
            response = self.session.get(
                f"{API_BASE}/auth/me",
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 401:
                data = response.json()
                self.log_test(test_name, True, "Missing token properly rejected")
                return True, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Expected 401 but got {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during missing token test: {str(e)}")
            return False, {"error": str(e)}
    
    def test_health_endpoint(self):
        """Test /health endpoint for rebranding"""
        test_name = "Health Check Endpoint"
        
        try:
            response = self.session.get(f"{BACKEND_URL}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Mentaurra API is running!" in data["message"]:
                    self.log_test(test_name, True, "Health endpoint returns correct Mentaurra message")
                    return True, data
                else:
                    self.log_test(test_name, False, "Health endpoint message not updated to Mentaurra", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Health endpoint failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during health check: {str(e)}")
            return False, {"error": str(e)}
    
    def test_root_endpoint(self):
        """Test / endpoint for rebranding"""
        test_name = "Root Endpoint"
        
        try:
            response = self.session.get(f"{BACKEND_URL}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Welcome to Mentaurra API" in data["message"]:
                    self.log_test(test_name, True, "Root endpoint returns correct Mentaurra welcome message")
                    return True, data
                else:
                    self.log_test(test_name, False, "Root endpoint message not updated to Mentaurra", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Root endpoint failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during root endpoint test: {str(e)}")
            return False, {"error": str(e)}
    
    def test_list_jobs(self):
        """Test GET /api/jobs endpoint"""
        test_name = "List Jobs"
        
        try:
            response = self.session.get(f"{API_BASE}/jobs", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test(test_name, True, f"Jobs list retrieved successfully ({len(data)} jobs)")
                    return True, data
                else:
                    self.log_test(test_name, False, "Jobs endpoint should return a list", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"List jobs failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during list jobs: {str(e)}")
            return False, {"error": str(e)}
    
    def test_create_job(self, email: str):
        """Test POST /api/jobs endpoint with employer authentication"""
        test_name = f"Create Job ({email})"
        
        if email not in self.tokens:
            self.log_test(test_name, False, f"No token available for {email}")
            return False, {}
        
        headers = {
            "Authorization": f"Bearer {self.tokens[email]}",
            "Content-Type": "application/json"
        }
        
        job_payload = {
            "title": "Senior Software Engineer",
            "company": "Mentaurra Tech",
            "location": "San Francisco, CA",
            "salary": "$120,000 - $150,000",
            "description": "We are looking for a senior software engineer to join our team.",
            "requirements": "5+ years of experience in Python and React",
            "employment_type": "full_time"
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/jobs",
                json=job_payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "title" in data:
                    self.log_test(test_name, True, f"Job created successfully with ID: {data.get('id')}")
                    return True, data
                else:
                    self.log_test(test_name, False, "Job creation response missing required fields", {"response": data})
                    return False, data
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Job creation failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during job creation: {str(e)}")
            return False, {"error": str(e)}
    
    def test_get_specific_job(self, job_id: str):
        """Test GET /api/jobs/{job_id} endpoint"""
        test_name = f"Get Specific Job ({job_id})"
        
        try:
            response = self.session.get(f"{API_BASE}/jobs/{job_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["id"] == job_id:
                    self.log_test(test_name, True, f"Job {job_id} retrieved successfully")
                    return True, data
                else:
                    self.log_test(test_name, False, "Job data doesn't match requested ID", {"response": data})
                    return False, data
            elif response.status_code == 404:
                self.log_test(test_name, True, f"Job {job_id} not found (expected for non-existent job)")
                return True, {"message": "Job not found"}
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Get job failed with status {response.status_code}", {"response": data})
                return False, data
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during get job: {str(e)}")
            return False, {"error": str(e)}
    
    def test_role_based_access_control(self, candidate_email: str, employer_email: str):
        """Test that candidates cannot create jobs but employers can"""
        test_name = "Role-based Access Control"
        
        # Test candidate trying to create job (should fail)
        if candidate_email not in self.tokens:
            self.log_test(test_name, False, f"No token available for candidate {candidate_email}")
            return False
        
        candidate_headers = {
            "Authorization": f"Bearer {self.tokens[candidate_email]}",
            "Content-Type": "application/json"
        }
        
        job_payload = {
            "title": "Test Job",
            "company": "Test Company",
            "location": "Test Location",
            "salary": "$50,000",
            "description": "Test description",
            "requirements": "Test requirements",
            "employment_type": "full_time"
        }
        
        try:
            # Candidate should be forbidden
            response = self.session.post(
                f"{API_BASE}/jobs",
                json=job_payload,
                headers=candidate_headers,
                timeout=10
            )
            
            if response.status_code == 403:
                self.log_test(test_name, True, "Candidates properly forbidden from creating jobs")
                
                # Now test that employer can create jobs
                if employer_email in self.tokens:
                    employer_success, _ = self.test_create_job(employer_email)
                    if employer_success:
                        self.log_test(test_name, True, "Role-based access control working correctly")
                        return True
                    else:
                        self.log_test(test_name, False, "Employer cannot create jobs (unexpected)")
                        return False
                else:
                    self.log_test(test_name, False, f"No token available for employer {employer_email}")
                    return False
            else:
                try:
                    data = response.json()
                except:
                    data = {"raw_response": response.text}
                self.log_test(test_name, False, f"Candidate was not forbidden (got {response.status_code})", {"response": data})
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test(test_name, False, f"Network error during role access test: {str(e)}")
            return False
        """Test bcrypt password hashing compatibility"""
        test_name = "Bcrypt Compatibility Test"
        
        # Test with a specific user to check if bcrypt is working
        test_email = "bcrypt_test@example.com"
        test_password = "test_bcrypt_password_123"
        
        # First try to signup
        signup_success, signup_data = self.test_user_signup(
            test_email, test_password, "Bcrypt Test User", "candidate"
        )
        
        if not signup_success and "already registered" not in str(signup_data):
            self.log_test(test_name, False, "Bcrypt test failed during signup", {"signup_data": signup_data})
            return False
        
        # Then try to login to verify password verification works
        login_success, login_data = self.test_user_login(test_email, test_password)
        
        if login_success:
            self.log_test(test_name, True, "Bcrypt password hashing and verification working correctly")
            return True
        else:
            self.log_test(test_name, False, "Bcrypt password verification failed", {"login_data": login_data})
            return False
    
    def run_all_tests(self):
        """Run the complete backend test suite for Mentaurra rebranding verification"""
        print("🚀 Starting Mentaurra Backend API Tests")
        print("=" * 60)
        
        # Test backend health first
        if not self.test_backend_health():
            print("\n❌ Backend is not accessible. Stopping tests.")
            return False
        
        print("\n🏥 Testing Rebranding - Health & Root Endpoints...")
        # Test rebranding changes
        self.test_health_endpoint()
        self.test_root_endpoint()
        
        print("\n📝 Testing User Registration...")
        # Test user signup for candidate
        candidate_email = "sarah.johnson@mentaurra.com"
        self.test_user_signup(
            candidate_email, 
            "SecurePass123!", 
            "Sarah Johnson", 
            "candidate"
        )
        
        # Test user signup for employer
        employer_email = "hiring@techcorp.com"
        self.test_user_signup(
            employer_email, 
            "HiringPass456!", 
            "Tech Corp Recruiter", 
            "employer"
        )
        
        print("\n🔐 Testing User Login...")
        # Test login for both users
        self.test_user_login(candidate_email, "SecurePass123!")
        self.test_user_login(employer_email, "HiringPass456!")
        
        print("\n🎫 Testing Token Verification...")
        # Test token verification
        self.test_token_verification(candidate_email)
        self.test_token_verification(employer_email)
        
        print("\n📋 Testing Job Management...")
        # Test job listing
        self.test_list_jobs()
        
        # Test job creation (employer only)
        job_success, job_data = self.test_create_job(employer_email)
        created_job_id = None
        if job_success and isinstance(job_data, dict) and "id" in job_data:
            created_job_id = job_data["id"]
            
        # Test getting specific job
        if created_job_id:
            self.test_get_specific_job(created_job_id)
        else:
            # Test with a non-existent job ID
            self.test_get_specific_job("non-existent-job-id")
        
        print("\n🔒 Testing Role-based Access Control...")
        # Test role-based access control
        self.test_role_based_access_control(candidate_email, employer_email)
        
        print("\n🚫 Testing Error Handling...")
        # Test error scenarios
        self.test_invalid_credentials()
        self.test_missing_token()
        
        print("\n🔒 Testing Bcrypt Compatibility...")
        # Test bcrypt specifically
        self.test_bcrypt_compatibility()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 MENTAURRA BACKEND TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        else:
            print("\n🎉 All Mentaurra backend tests passed!")
        
        return failed_tests == 0

def main():
    """Main test execution for Mentaurra backend API verification"""
    tester = AuthenticationTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All Mentaurra backend tests passed!")
        sys.exit(0)
    else:
        print("\n💥 Some Mentaurra backend tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()