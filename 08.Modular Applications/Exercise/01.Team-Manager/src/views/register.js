import { register } from '../api/data.js';
import { html } from '../lib.js';

const template = (onRegister, errorMsg) => html`
<section id="register">
    <article class="narrow">
        <header class="pad-med">
            <h1>Register</h1>
        </header>
        <form @submit=${onRegister} id="register-form" class="main-form pad-large">
            ${errorMsg ? html`<div class="error">${errorMsg}</div>` : null}
            <label>E-mail: <input type="email" name="email"></label>
            <label>Username: <input type="text" name="username"></label>
            <label>Password: <input type="password" name="password"></label>
            <label>Repeat: <input type="password" name="repass"></label>
            <input class="action cta" type="submit" value="Create Account">
        </form>
        <footer class="pad-small">Already have an account? <a href="/login" class="invert">Sign in here</a>
        </footer>
    </article>
</section>
`;

export async function registerPage(ctx) {
    update();

    function update(errorMsg = '') {
        ctx.render(template(onRegister, errorMsg));
    }

    async function onRegister(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const email = formData.get('email').trim();
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();
        const repass = formData.get('repass').trim();

        try {
            if (email == '' || username == '' || password == '' || repass == '') {
                throw new Error('All fields are required!');
            }

            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters long!');
            }

            if (password.length < 3) {
                throw new Error('Password must be at least 3 characters/digits long!');
            }

            if (password != repass) {
                throw new Error('Password don\' t match!');
            }

            await register(email, username, password);
            ctx.page.redirect('my-teams');
            ctx.updateUserNav();
        }
        catch (error) {
            update(error.message);
        }
    }
}