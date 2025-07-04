class Captcha extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.value = "";
        this.callback = null;
    }

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

        this.dialog = this.shadowRoot.querySelector('#captchaPanel');
        this.captchaImage = this.shadowRoot.querySelector('#captchaImage');
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

    refreshCaptcha(scene) {
        const timestamp = new Date().getTime();
        this.captchaImage.src = `/login/captcha?t=${timestamp}&scene=${scene}`;
        this.captchaInput.value = "";
    }

    show(scene,callback) {
        this.callback = callback;
        this.dialog.open = true;
        this.refreshCaptcha(scene);
    }
}

// 注册组件
customElements.define('nova-captcha', Captcha);
