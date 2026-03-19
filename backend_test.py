import requests
import sys
from datetime import datetime, timedelta
import uuid

class CRMAPITester:
    def __init__(self, base_url="https://insurance-crm-qc.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_client_id = None

    def log(self, message, emoji="ℹ️"):
        """Log test messages with timestamp"""
        print(f"{emoji} {datetime.now().strftime('%H:%M:%S')} - {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        
        # Default headers
        test_headers = {'Content-Type': 'application/json'}
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"Testing {name}... ({method} {endpoint})", "🔍")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"PASSED - {name} (Status: {response.status_code})", "✅")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                self.log(f"FAILED - {name} (Expected {expected_status}, got {response.status_code})", "❌")
                try:
                    error_detail = response.json()
                    self.log(f"Response: {error_detail}", "🔴")
                except:
                    self.log(f"Response: {response.text[:200]}", "🔴")
                return False, {}

        except requests.exceptions.Timeout:
            self.log(f"FAILED - {name} (Request timeout)", "❌")
            return False, {}
        except Exception as e:
            self.log(f"FAILED - {name} (Error: {str(e)})", "❌")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log(f"Login successful for {email}", "🔑")
            return True, response
        
        self.log(f"Login failed for {email}", "🚫")
        return False, response

    def test_get_me(self):
        """Test get current user info"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "api/auth/me",
            200
        )
        return success, response

    def test_get_stats(self):
        """Test dashboard statistics"""
        success, response = self.run_test(
            "Dashboard Statistics",
            "GET",
            "api/stats",
            200
        )
        
        if success:
            required_fields = ['total_clients', 'total_prospects', 'rdv_this_month', 'suivis_pending']
            for field in required_fields:
                if field not in response:
                    self.log(f"Missing field in stats: {field}", "⚠️")
                    return False, response
            self.log(f"Stats: {response}", "📊")
        
        return success, response

    def test_get_clients(self):
        """Test get clients list"""
        success, response = self.run_test(
            "Get Clients List",
            "GET",
            "api/clients",
            200
        )
        
        if success:
            self.log(f"Found {len(response)} clients", "📝")
        
        return success, response

    def test_create_client(self):
        """Test create new client"""
        client_data = {
            "prenom": "Test",
            "nom": f"Client_{datetime.now().strftime('%H%M%S')}",
            "telephone": "514-555-0123",
            "courriel": "test.client@example.com",
            "adresse": "123 Test Street, Montreal, QC",
            "conjoint": "Test Spouse",
            "nb_enfants": 2,
            "statut": "prospect",
            "date_rdv": (datetime.now() + timedelta(days=7)).isoformat(),
            "date_suivi": (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d'),
            "notes": "<p>Test notes with <strong>rich text</strong></p>",
            "source": "reference"
        }
        
        success, response = self.run_test(
            "Create Client",
            "POST",
            "api/clients",
            200,  # API returns 200, not 201
            data=client_data
        )
        
        if success and 'id' in response:
            self.created_client_id = response['id']
            self.log(f"Created client with ID: {self.created_client_id}", "✨")
        
        return success, response

    def test_get_client(self, client_id):
        """Test get specific client"""
        success, response = self.run_test(
            "Get Specific Client",
            "GET",
            f"api/clients/{client_id}",
            200
        )
        return success, response

    def test_update_client(self, client_id):
        """Test update client"""
        update_data = {
            "notes": "<p>Updated notes with <em>italic text</em></p>",
            "statut": "actif"
        }
        
        success, response = self.run_test(
            "Update Client",
            "PUT",
            f"api/clients/{client_id}",
            200,
            data=update_data
        )
        return success, response

    def test_search_clients(self):
        """Test client search functionality"""
        success, response = self.run_test(
            "Search Clients",
            "GET",
            "api/clients?search=Test",
            200
        )
        return success, response

    def test_filter_clients(self):
        """Test client filtering by status"""
        success, response = self.run_test(
            "Filter Clients by Status",
            "GET",
            "api/clients?statut=prospect",
            200
        )
        return success, response

    def test_get_rdv(self):
        """Test get RDV agenda"""
        success, response = self.run_test(
            "Get RDV Agenda",
            "GET",
            "api/agenda/rdv",
            200
        )
        return success, response

    def test_get_suivis(self):
        """Test get Suivis agenda"""
        success, response = self.run_test(
            "Get Suivis Agenda",
            "GET",
            "api/agenda/suivis",
            200
        )
        return success, response

    def test_export_csv(self):
        """Test CSV export"""
        success, response = self.run_test(
            "Export Clients CSV",
            "GET",
            "api/clients/export/csv",
            200
        )
        return success, response

    def test_delete_client(self, client_id):
        """Test delete client"""
        success, response = self.run_test(
            "Delete Client",
            "DELETE",
            f"api/clients/{client_id}",
            200
        )
        return success, response

def main():
    """Main test execution"""
    tester = CRMAPITester()
    
    print("=" * 60)
    print("🏥 Starting CRM API Tests")
    print("=" * 60)
    
    # Test 1: Root endpoint
    if not tester.test_root_endpoint():
        print("❌ Root endpoint failed, stopping tests")
        return 1

    # Test 2: Login
    login_success, login_response = tester.test_login("conseiller3@demo.com", "password123")
    if not login_success:
        print("❌ Login failed, stopping tests")
        return 1

    # Test 3: Get current user
    if not tester.test_get_me()[0]:
        print("⚠️ Get user info failed")

    # Test 4: Dashboard stats
    if not tester.test_get_stats()[0]:
        print("⚠️ Dashboard stats failed")

    # Test 5: Get clients
    if not tester.test_get_clients()[0]:
        print("⚠️ Get clients failed")

    # Test 6: Create client
    if not tester.test_create_client()[0]:
        print("⚠️ Create client failed")

    # Test 7: Get specific client (if created)
    if tester.created_client_id:
        if not tester.test_get_client(tester.created_client_id)[0]:
            print("⚠️ Get specific client failed")

        # Test 8: Update client
        if not tester.test_update_client(tester.created_client_id)[0]:
            print("⚠️ Update client failed")

    # Test 9: Search functionality
    if not tester.test_search_clients()[0]:
        print("⚠️ Search clients failed")

    # Test 10: Filter functionality  
    if not tester.test_filter_clients()[0]:
        print("⚠️ Filter clients failed")

    # Test 11: Agenda endpoints
    if not tester.test_get_rdv()[0]:
        print("⚠️ Get RDV agenda failed")

    if not tester.test_get_suivis()[0]:
        print("⚠️ Get Suivis agenda failed")

    # Test 12: CSV Export
    if not tester.test_export_csv()[0]:
        print("⚠️ CSV export failed")

    # Test 13: Delete client (cleanup)
    if tester.created_client_id:
        if not tester.test_delete_client(tester.created_client_id)[0]:
            print("⚠️ Delete client failed")

    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    print("=" * 60)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())