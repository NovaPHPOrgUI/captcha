# Captcha 验证码组件

> jsMap key: `Captcha`

## 用法

Web Component，在模板中使用：

```html
<captcha-box id="captcha"></captcha-box>
```

JS 中调用验证码：

```javascript
window.pageLoadFiles = ['Captcha'];
window.pageOnLoad = function () {
    const captcha = $('captcha-box')[0];

    // 触发验证码弹窗，用户完成后回调返回验证码值
    captcha.show(function (value) {
        // value 为用户输入的验证码
        $.request.postForm('/api/submit', { captcha: value }, function (res) {
            // ...
        });
    });

    return false;
};
```

## 说明

- 自动显示验证码图片弹窗
- 用户输入后通过回调返回验证码值
- 基于 Shadow DOM 封装样式

