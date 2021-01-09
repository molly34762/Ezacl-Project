from fastapi.testclient import TestClient
import json

from server import app

client = TestClient(app)

# Method for testing the endpoint /api/v1/user_input


def test_invalid_ip_addresses():
    # Ip address with letters
    data = {'ip_address': 'aaaaaaaaa'}
    response = client.post('/api/v1/user_input', data=data)
    assert response.json() == {'response': 'invalid query'}
    # Ip address with invalid form
    data = {'ip_address': '0214343221'}
    response = client.post('/api/v1/user_input', data=data)
    assert response.json() == {'response': 'invalid query'}
    # Empty Ip address
    data = {'ip_address': ''}
    response = client.post('/api/v1/user_input', data=data)
    assert response.json() == {'detail': [{'loc': [
        'body', 'ip_address'], 'msg': 'field required', 'type': 'value_error.missing'}]}


if __name__ == '__main__':
    test_invalid_ip_addresses()
