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

