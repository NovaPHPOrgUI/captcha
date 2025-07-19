/**
 * 验证码组件
 * 提供图形验证码显示、输入和验证功能
 * @file Captcha.js
 * @author License Auto System
 * @version 1.0.0
 */

/**
 * 验证码组件类
 * 继承自HTMLElement，提供自定义验证码元素
 */
class Captcha extends HTMLElement {
    /**
     * 构造函数
     * 初始化Shadow DOM和组件属性
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        /** @type {string} 验证码值 */
        this.value = "";
        /** @type {Function|null} 验证码回调函数 */
        this.callback = null;
    }

    /**
     * 组件连接到DOM时调用
     * 初始化组件结构和事件绑定
     */
    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <style>
            mdui-dialog.captchaPanel::part(panel) {
                width: 95%;
                max-width: 400px;
            }
            mdui-dialog.captchaPanel::part(body) {
                overflow-x: hidden;
                scrollbar-width: thin;
                scrollbar-color: rgba(var(--mdui-color-on-background) / 0.5) rgba(var(--mdui-color-background) / 0.5);
                padding: var(--nova-padding);
                margin-top: 3rem!important;
            }
            .captcha-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }
            .input-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
            }
            .captcha-image {
                cursor: pointer;
                height: 40px;
                border-radius: 4px;
            }
            mdui-text-field {
                flex: 1;
            }
        </style>
        <mdui-dialog id="captchaPanel" class="captchaPanel">
            <mdui-top-app-bar slot="header" class="ml-4 mr-4 mt-2">
                <mdui-top-app-bar-title>请输入验证码</mdui-top-app-bar-title>
                <mdui-button-icon icon="close" id="closeDialog"></mdui-button-icon>
            </mdui-top-app-bar>
            <div class="captcha-container">
                <div class="input-group">
                    <mdui-text-field id="captchaInput" name="captcha" label="验证码" required></mdui-text-field>
                    <img id="captchaImage" class="captcha-image" alt="验证码" />
                </div>
            </div>
            <mdui-button slot="action" id="submitCaptcha">确认</mdui-button>
        </mdui-dialog>`;

        /** @type {HTMLElement} 验证码对话框元素 */
        this.dialog = this.shadowRoot.querySelector('#captchaPanel');
        /** @type {HTMLImageElement} 验证码图片元素 */
        this.captchaImage = this.shadowRoot.querySelector('#captchaImage');
        /** @type {HTMLElement} 验证码输入框元素 */
        this.captchaInput = this.shadowRoot.querySelector('#captchaInput');
        
        // 绑定事件
        this.shadowRoot.querySelector('#closeDialog').addEventListener('click', () => {
            this.dialog.open = false;
            if (this.callback) this.callback(null);
        });
        this.captchaImage.addEventListener('click', () => this.refreshCaptcha());
        
        this.shadowRoot.querySelector('#submitCaptcha').addEventListener('click', () => {
            const value = this.captchaInput.value.trim();
            if (!value) {
                $.toaster.error('请输入验证码');
                return;
            }
            if (this.callback) {
                this.callback({
                    captcha: value,
                });
            }
            this.dialog.open = false;
        });

    }

    /**
     * 刷新验证码图片
     * 重新加载验证码图片并清空输入框
     */
    refreshCaptcha() {
        const timestamp = new Date().getTime();
        this.captchaImage.src = `/login/captcha?t=${timestamp}`;
        this.captchaInput.value = "";
    }

    /**
     * 显示验证码对话框
     * @param {Function} callback - 验证码输入完成后的回调函数
     */
    show(callback) {
        this.callback = callback;
        this.dialog.open = true;
        this.refreshCaptcha();
    }
}

/**
 * 注册自定义验证码元素
 */
customElements.define('nova-captcha', Captcha);
