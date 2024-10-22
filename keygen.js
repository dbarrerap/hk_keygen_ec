document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const pbar = document.querySelector('#progressBar')
    const btnCopy = document.querySelector('#btn-addon-copy')
    const btnRefresh = document.querySelector('#btn-addon-refresh')
    const btnClear = document.querySelector('#btn-addon-clear')
    const txtCode = document.querySelector('#txt-code')
    const cmbSelectedGame = document.querySelector('#cmb-game')
    const ul = document.querySelector('#messages')
    const pBarText = document.querySelector('#pBarText')
    const btnRestore = document.querySelector('#btn-addon-restore')
    let pBarPercentage = 0;

    // Events
    btnCopy.addEventListener('click', () => {
        txtCode.focus()
        txtCode.select()
        txtCode.setSelectionRange(0, 99999)
        navigator.clipboard.writeText(txtCode.value)
        Swal.fire({
            titleText: 'Codigo copiado',
            timer: 1750,
            timerProgressBar: true,
            showConfirmButton: false,
        })
    })

    btnClear.addEventListener('click', () => {
        txtCode.value = ''
        // latchButtons(true)
        setProgressBar(0)
        clearMessages()
    })

    btnRestore.addEventListener('click', async () => {
        const confirmation = await Swal.fire({
            titleText: 'Desea restablecer el ID del dispositivo?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            focusCancel: true,
            allowOutsideClick: false,
        })
        if (confirmation.isConfirmed) {
            localStorage.clear()
            Swal.fire({
                titleText: 'ID restablecido',
                timer: 2500,
                timerProgressBar: true,
                icon: 'success',
                showConfirmButton: false,
            })
        }
    })

    btnRefresh.addEventListener('click', async () => {
        const confirmation = await Swal.fire({
            titleText: 'Desea solicitar un nuevo codigo?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            focusCancel: true,
            allowOutsideClick: false,
        })
        if (confirmation.isConfirmed) {
            const selectedGame = cmbSelectedGame.value
            generateCode(selectedGame)
        }
    })

    cmbSelectedGame.addEventListener('change', (event) => {
        generateCode(event.target.value)
    })

    // APPS Enum
    const app = [
        { 
            code: 'TRAIN', label: 'Train Miner', 
            token: '82647f43-3f87-402d-88dd-09a90025313f', promo: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
            attempts: 10, delay: 2e4,
        },
        {
            code: 'FCTRY', label: 'Factory World',
            token: 'd02fc404-8985-4305-87d8-32bd4e66bb16', promo: 'd02fc404-8985-4305-87d8-32bd4e66bb16',
            attempts: 10, delay: 4e4,
        },
        {
            code: 'COUNT', label: 'Count Masters',
            token: '4bdc17da-2601-449b-948e-f8c7bd376553', promo: '4bdc17da-2601-449b-948e-f8c7bd376553',
            attempts: 20, delay: 4e4,
        },
        {
            code: 'SNAKE', label: 'Snake Run',
            token: 'c8e017e2-8817-4d02-bce6-b951e74bb18f', promo: 'c8e017e2-8817-4d02-bce6-b951e74bb18f',
            attempts: 30, delay: 2e4,
        },
        {
            code: 'MERGE', label: 'Merge Away',
            token: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833', promo: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
            attempts: 10, delay: 2e4,
        },
        {
            code: 'COOKST', label: 'Cooking Stories',
            token: 'ed526e8c-e6c8-40fd-b72a-9e78ff6a2054', promo: 'ed526e8c-e6c8-40fd-b72a-9e78ff6a2054',
            attempts: 10, delay: 4e4,
        },
        {
            code: 'CUBE', label: 'Chain Cube 2048',
            token: 'd1690a07-3780-4068-810f-9b5bbf2931b2', promo: '4170868-cef0-424f-8eb9-be0622e8e8e3',
            attempts: 10, delay: 2e4,
        },
        {
            code: 'INFCT', label: 'Infected Frontier',
            token: 'eb518c4b-e448-4065-9d33-06f3039f0fcb', promo: 'eb518c4b-e448-4065-9d33-06f3039f0fcb',
            attempts: 10, delay: 4e4,
        },
        {
            code: 'BOUNCE', label: 'Bouncemasters',
            token: 'bc72d3b9-8e91-4884-9c33-f72482f0db37', promo: 'bc72d3b9-8e91-4884-9c33-f72482f0db37',
            attempts: 10, delay: 2e4,
        },
        {
            code: 'POLYSPHERE', label: 'Polysphere',
            token: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71', promo: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            attempts: 22, delay: 2e4,
        },
        {
            code: 'ZOOPOLIS', label: 'Zoopolis',
            token: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b', promo: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            attempts: 20, delay: 2e4,
        },
    ]

    for (const {code, label} of app) {
        const opt = document.createElement('option')
        opt.value = code
        opt.innerHTML = label
        cmbSelectedGame.appendChild(opt)
        // console.log(entry)
    }

    const generateId = (selectedGame) => {
        const fecha = Date.now();
        const random = localStorage.getItem(selectedGame) || Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join("");
        localStorage.setItem(selectedGame, random);

        return `${fecha}-${random}`;
    }

    const login = async (selectedGame, appToken) => {
        // console.log('Logging in...')
        const deviceId = generateId(selectedGame)

        const response = await fetch("https://api.gamepromo.io/promo/login-client", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", Host: "api.gamepromo.io" },
            body: JSON.stringify({ appToken: appToken, clientId: deviceId, clientOrigin: "deviceid" })
        }), { clientToken: r } = await response.json()

        return r
    }

    const register = async (clientToken, promo) => {
        // console.log('Registering...')
        const response = await fetch("https://api.gamepromo.io/promo/register-event", {
            method: "POST",
            headers: { Authorization: `Bearer ${clientToken}`, "Content-Type": "application/json; charset=utf-8", Host: "api.gamepromo.io" },
            body: JSON.stringify({ promoId: promo, eventId: window.crypto.randomUUID(), eventOrigin: "undefined" })
        }), { hasCode: r } = await response.json()

        return r
    }

    const generate = async (clientToken, promo) => {
        // console.log('Generating...')
        const response = await fetch("https://api.gamepromo.io/promo/create-code", {
            method: "POST",
            headers: { Authorization: `Bearer ${clientToken}`, "Content-Type": "application/json; charset=utf-8", Host: "api.gamepromo.io" },
            body: JSON.stringify({ promoId: promo })
        }), { promoCode: r } = await response.json()

        return r;
    }

    const generateCode = async (selectedGame) => {
        
        // Validar seleccion
        // console.log(selectedGame)
        if (selectedGame === '-- SELECT --') return

        // Housekeeping
        clearMessages()
        txtCode.value = ''
        latchButtons(true)
        cmbSelectedGame.disabled = true
        setProgressBar(0)

        try {
            // Obtener data del juego seleccionado 
            const {token, promo, attempts, delay} = app.find(e => e['code'] == selectedGame)
            console.log(token, promo, attempts, delay)
            // return
            // Inicar sesion
            const litem = document.createElement('li')
            litem.appendChild(document.createTextNode('Iniciando Sesion'));
            ul.appendChild(litem)
            const clientToken = await login(selectedGame, token);
            if (!clientToken) throw new Error(`[Login] Error -- No se ha iniciado sesion exitosamente`)
            litem.appendChild(document.createTextNode('...OK'));
            setProgressBar(15)

            // Registrar
            const lregister = document.createElement('li')
            lregister.appendChild(document.createTextNode('Solicitando'))
            ul.appendChild(lregister)
            let r = null;
            let c = 0
            for (; !r && c < attempts; c++) {
                await sleep(delay * delayRandom())
                r = await register(clientToken, promo);
                r ? lregister.appendChild(document.createTextNode('OK')) : lregister.appendChild(document.createTextNode('.'))
                ul.appendChild(lregister)
                setProgressBar(pBarPercentage + (70 / attempts))
            }
            if (c > attempts) throw new Error('[Register] Error -- Se ha superado el limite de intentos.')

            // Obtener
            const lcreate = document.createElement('li')
            const keyCode = await generate(clientToken, promo);
            if (!keyCode) throw new Error('[Generate] Error -- Hubo un problema recuperando el codigo.')
            lcreate.appendChild(document.createTextNode('Codigo generado!'));
            ul.appendChild(lcreate)
            setProgressBar(100)
            txtCode.value = keyCode

        } catch (err) {
            const lerror = document.createElement('li')
            lerror.appendChild(document.createTextNode(err))
            ul.appendChild(lerror)
            console.log(err)
        } finally {
            latchButtons(false)
            cmbSelectedGame.disabled = false
        }

    }

    // Helpers
    const clearMessages = () => {
        const ul = document.querySelector('#messages')
        while (ul.firstChild) ul.removeChild(ul.firstChild)
    }

    const latchButtons = (state) => {
        btnCopy.disabled = state
        btnRefresh.disabled = state
        btnClear.disabled = state
    }

    const delayRandom = () => Math.random() / 3 + 1

    const sleep = (duration) => new Promise(r => setTimeout(r, duration))

    const setProgressBar = (value) => {
        pBarPercentage = value
        pbar.style.width = `${value}%`
        pBarText.innerHTML = `${roundTo(value, 2)}%`
    }

    const roundTo = (number, precision) => {
        const factor = Math.pow(10, precision)
        return Math.round(number * factor) / factor
    }
})

/**
 * Changelog
 * 
 * 1.0.0 Implementacion inicial. Consulta codigo de llaves al seleccionar un juego de la lista.
 * 1.1.0 Agregar botones de copia, regenerar y borrado. Se cambia el spinner a progressbar para mejor retroalimentacion.
 * 1.1.1 Agregar mensajes de progreso, Instrucciones y Aviso Legal
 * 1.2.0 Nuevo juego, Merge Away. Carga dinamica de lista desplegable. Separacion de deviceid por juego.
 * 1.2.1 Nuevo juego, Twerk Race.
 * 1.2.2 Parametrizacion de intentos. Mostrar error en Mensajes. Ajuste de logica onChange.
 * 1.2.3 Ajuste en mostrado de valor de barra. Uso de Toast para mensajes
 * 1.2.4 Uso de SweetAlert para mostrar mensajes emergentes.
 * 1.2.5 Nuevo juego, Polysphere
 * 1.2.6 Nuevos juegos, Mud Racing y Mow and Trim. Ajustes de tiempo en Clone.
 * 1.2.7 Se retira Clone Army
 * 1.2.8 Nuevo juego, Cafe Dash. UI: Titulo con nombre
 * 1.2.9 Nuevos juegos, Zoopolis, Gang Wars.
 * 1.2.10 Se retiran varios juegos.
 * 1.2.11 Nuevo juego, Tile Trio. Ammend: Fluff Crusade
 * 1.2.12 Nuevo Juego: Stone Age
 * 1.2.13 Nuevo juego: Bouncemasters
 * 1.2.14 Nuevo juego: Hide Ball
 * 1.2.15 Nuevos juegos: Pin Out Master, Count Masters
 * 1.2.16 Nuevos juegos: Factory World, Among Water, Infected Frontier
 * 1.2.17 Nuevos juegos: Cooking Stories, Snake Run
 * 1.2.17.1 Se retiran varios juegos.
 * 1.2.18 Nuevo arreglo para hacer uso de una sola estructura de datos
 */