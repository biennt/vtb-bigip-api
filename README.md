# vtb-bigip-api

## API trung gian giao tiếp với BIG-IP
API này đứng giữa user/app và các instance F5 BIG-IP, chỉ thực hiện một số chức năng cần thiết thay vì phơi toàn bộ API của BIG-IP
## Cài đặt
Yêu cầu máy chủ có cài nodejs, npm và các module cần thiết (xem file package.json). Ngoài ra, để chạy trơn tru, có thể cần thêm module pm2 và hoặc đóng gói trong container nữa thì càng tốt.

Download source về:
```
git clone https://github.com/biennt/vtb-bigip-api.git
```

Cài đặt các package cần thiết (express, axios..)
```
cd vtb-bigip-api
npm install
```

Xong rồi có thể chạy trực tiếp bằng node
```
node index.js
```

Hoặc chạy bằng nodemon (trong lúc phát triển, thay đổi thì nên dùng cái này)
```
nodemon index.js
```

Hoặc dùng pm2 (cài đặt bằng `npm install pm2@latest -g`):
```
pm2 start app.js
```

## Cấu hình, khai báo tài khoản vào các con BIG-IP cũng như api key, quyền cho API client
Các thông tin về tài khoản đều nằm trong file config.json.
Trong đó có 2 phần
- instances là một mảng chứa danh sách các con BIG-IP có thể tác động, đi kèm là địa chỉ IP quản trị, port của giao diện iControl Rest, tài khoản trên từng con BIG-IP
- keys là một mảng chứa thông tin xác thực của API client, gồm có owner (tương tự username), keydata (tương tự password), pool và bigip là các đối tượng mà client này được phép truy cập

## Sử dụng
Dùng postman hoặc curl, gửi kèm apikey dưới dạng header theo format: owner-keydata (ví dụ quanna-Abc123).
Hiện tại mới có những endpoint sau được thực hiện:

- /api/bigips: xem danh sách các con BIG-IP đã được khai báo trong config.json (chỉ cần có 1 apikey hợp lệ là xem được)
Ví dụ:
```
curl  -H 'apikey: quanna-Abc123' http://localhost:3300/api/bigips

kết qủa cho ra:
[{"name":"bigip1","address":"172.16.224.133","port":"8443","user":"apiuser"},{"name":"bigip2","address":"5.6.7.8","port":"443","user":"apiuser"}]
```
- /api/:instance_name/pools: xem danh sách các pool trên 1 con BIG-IP cụ thể
Ví dụ:
```
curl  -H 'apikey: quanna-Abc123' http://localhost:3300/api/bigip1/pools

Kết quả cho ra:
{
  "kind": "tm:ltm:pool:poolcollectionstate",
  "selfLink": "https://localhost/mgmt/tm/ltm/pool?ver=15.1.10.2",
  "items": [
    {
      "kind": "tm:ltm:pool:poolstate",
      "name": "pool1",
      "partition": "Common",
      "fullPath": "/Common/pool1",
      "generation": 96,
      "selfLink": "https://localhost/mgmt/tm/ltm/pool/~Common~pool1?ver=15.1.10.2",
      "allowNat": "yes",
      "allowSnat": "yes",
      "ignorePersistedWeight": "disabled",
      "ipTosToClient": "pass-through",
      "ipTosToServer": "pass-through",
      "linkQosToClient": "pass-through",
      "linkQosToServer": "pass-through",
      "loadBalancingMode": "round-robin",
      "minActiveMembers": 0,
      "minUpMembers": 0,
      "minUpMembersAction": "failover",
      "minUpMembersChecking": "disabled",
      "monitor": "/Common/http",
      "queueDepthLimit": 0,
      "queueOnConnectionLimit": "disabled",
      "queueTimeLimit": 0,
      "reselectTries": 0,
      "serviceDownAction": "none",
      "slowRampTime": 10,
      "membersReference": {
        "link": "https://localhost/mgmt/tm/ltm/pool/~Common~pool1/members?ver=15.1.10.2",
        "isSubcollection": true
      }
    },
    {
      "kind": "tm:ltm:pool:poolstate",
      "name": "pool2",
      "partition": "Common",
      "fullPath": "/Common/pool2",
      "generation": 1,
      "selfLink": "https://localhost/mgmt/tm/ltm/pool/~Common~pool2?ver=15.1.10.2",
      "allowNat": "yes",
      "allowSnat": "yes",
      "ignorePersistedWeight": "disabled",
      "ipTosToClient": "pass-through",
      "ipTosToServer": "pass-through",
      "linkQosToClient": "pass-through",
      "linkQosToServer": "pass-through",
      "loadBalancingMode": "round-robin",
      "minActiveMembers": 0,
      "minUpMembers": 0,
      "minUpMembersAction": "failover",
      "minUpMembersChecking": "disabled",
      "monitor": "/Common/http",
      "queueDepthLimit": 0,
      "queueOnConnectionLimit": "disabled",
      "queueTimeLimit": 0,
      "reselectTries": 0,
      "serviceDownAction": "none",
      "slowRampTime": 10,
      "membersReference": {
        "link": "https://localhost/mgmt/tm/ltm/pool/~Common~pool2/members?ver=15.1.10.2",
        "isSubcollection": true
      }
    },
    {
      "kind": "tm:ltm:pool:poolstate",
      "name": "pool3",
      "partition": "Common",
      "fullPath": "/Common/pool3",
      "generation": 1,
      "selfLink": "https://localhost/mgmt/tm/ltm/pool/~Common~pool3?ver=15.1.10.2",
      "allowNat": "yes",
      "allowSnat": "yes",
      "ignorePersistedWeight": "disabled",
      "ipTosToClient": "pass-through",
      "ipTosToServer": "pass-through",
      "linkQosToClient": "pass-through",
      "linkQosToServer": "pass-through",
      "loadBalancingMode": "round-robin",
      "minActiveMembers": 0,
      "minUpMembers": 0,
      "minUpMembersAction": "failover",
      "minUpMembersChecking": "disabled",
      "monitor": "/Common/tcp",
      "queueDepthLimit": 0,
      "queueOnConnectionLimit": "disabled",
      "queueTimeLimit": 0,
      "reselectTries": 0,
      "serviceDownAction": "none",
      "slowRampTime": 10,
      "membersReference": {
        "link": "https://localhost/mgmt/tm/ltm/pool/~Common~pool3/members?ver=15.1.10.2",
        "isSubcollection": true
      }
    }
  ]
}
```
