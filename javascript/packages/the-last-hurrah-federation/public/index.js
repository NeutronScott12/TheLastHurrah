const createAlert = (text, id) => {
    if (document.getElementById(id)) {
        return
    } else {
        const div = document.createElement('div')

        div.className = 'alert alert-danger'
        div.id = id

        div.appendChild(document.createTextNode(text))

        document.getElementById('resetPasswordForm').prepend(div)
    }
}

const removeElement = (id) => {
    let element = document.getElementById(id)

    if (typeof element != 'undefined' && element != null) {
        element.remove()
    }
}

const changePasswordForm = document.getElementById('resetPasswordForm')
changePasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = {
        password: event.target.newPassword.value,
        repeatPassword: event.target.repeatPassword.value,
        email: event.target.hiddenEmail.value,
        server_url: event.target.hiddenServerUrl.value,
    }
    if (!data.password || !data.repeatPassword) {
        createAlert('Both fields are required', 'requiredFields')
    } else {
        if (data.password === data.repeatPassword) {
            removeElement('requiredFields')
            removeElement('mustMatch')
            removeElement('errorMessage')

            const response = await fetch(data.server_url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            response
                .json()
                .then((data) => {
                    if (data.error) {
                        createAlert(data.error, 'errorMessage')
                    } else {
                        window.location.href = `${location.protocol}//${location.host}/user/password_changed`
                    }
                })
                .catch(console.error)
        } else {
            createAlert('Both passwords must match', 'mustMatch')
        }
    }
})
