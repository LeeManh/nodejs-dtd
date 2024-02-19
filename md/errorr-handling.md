Tất cả các lỗi nên được đưa về hết một chỗ để xử lý và trả về cho người dùng.

Chúng ta gọi chỗ đó là default error handler và nó sẽ được đặt ở cấp độ app

## Format lỗi trả về cho người dùng

Chúng ta nên thống nhất format lỗi trả về cho người dùng

Lỗi thường

```ts
{
  message: string
  error_info?: any
}
```

Lỗi validation (422)

```ts
{
  message: string,
  errors: {
    [field: string]: {
      msg: string
      [key: string]: any
    }
  }
}
```
