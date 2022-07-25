const realmApp = new Realm.App({
    id: "mongoapp-ucffa"
});

const email = document.getElementById('email-address');
const password = document.getElementById('password');
const login = document.getElementById('login-button');
const errorElement = document.getElementById('error');

async function onLoginClicked() {

    console.log('hello login')
    try {
        const emailPasswordCredential = Realm.Credentials.emailPassword(
            email.value.toLowerCase().trim(),
            password.value
        );
        const authenticateUser = await realmApp.logIn(emailPasswordCredential)
        console.log(authenticateUser)
        window.location.href = 'index.html';
    } catch (error) {
        console.log('catched->', error);
        email.value = '';
        password.value = '';
        errorElement.innerText = 'Please fill in the correct credentials!'

        setInterval(() => {
            errorElement.innerText = ''
        }, 2000);

    }


}
