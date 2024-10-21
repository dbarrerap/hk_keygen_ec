document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const pbar = document.querySelector('#progressBar')
    const btnCopy = document.querySelector('#btn-addon-copy')
    const btnRefresh = document.querySelector('#btn-addon-refresh')
    const btnClear = document.querySelector('#btn-addon-clear')
    const txtCode = document.querySelector('#txt-code')
    const cmbSelectedGame = document.querySelector('#cmb-game')
    const ul = document.querySelector('#messages')
    let pBarPercentage = 0;
    const pBarText = document.querySelector('#pBarText')
    const btnRestore = document.querySelector('#btn-addon-restore')

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
    const apps = Object.freeze({
        TRAIN: 'Train Miner',
        FCTRY: 'Factory World',
        COUNT: 'Count Master',
        SNAKE: 'Snake Run',
        MERGE: 'Merge Away',
        COOKST: 'Cooking Stories',
        CUBE: 'Chain Cube 2048',
        INFCT: 'Infected Frontier',
        BOUNCE: 'Bouncemasters',
        POLYSPHERE: 'Polysphere',
        ZOOPOLIS: 'Zoopolis',
        // BIKE: 'Bike Ride 3D',
        // CLONE: 'My Clone Army',
        // MOWTRIM: 'Mow and Trim',
        // TWERK: 'Twerk Race 3D',
        // MUDRACE: 'Mud Racing',
        // CAFE: 'Cafe Dash',
        // GANGWARS: 'Gang Wars',
        // TILETRIO: 'Tile Trio',
        // FLUFFCRUSADE: 'Fluff Crusade',
        // STONEAGE: 'Stone Age',
        // HIDEBALL: 'Hide Ball',
        // PINOUT: 'Pin Out Master',
        // AMONG: 'Among Water',
    })

    for (const [value, label] of Object.entries(apps)) {
        const opt = document.createElement('option')
        opt.value = value
        opt.innerHTML = label
        cmbSelectedGame.appendChild(opt)
    }

    // APS Token
    const tokens = Object.freeze({
        BIKE: Object.freeze({ token: 'd28721be-fd2d-4b45-869e-9f253b554e50', promo: '43e35910-c168-4634-ad4f-52fd764a843f', attempts: 22, delay: 2e4, }),
        CLONE: Object.freeze({ token: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb', promo: 'fe693b26-b342-4159-8808-15e3ff7f8767', attempts: 11, delay: 7e4, }),
        CUBE: Object.freeze({ token: 'd1690a07-3780-4068-810f-9b5bbf2931b2', promo: 'b4170868-cef0-424f-8eb9-be0622e8e8e3', attempts: 10, delay: 2e4, }),
        TRAIN: Object.freeze({ token: '82647f43-3f87-402d-88dd-09a90025313f', promo: 'c4480ac7-e178-4973-8061-9ed5b2e17954', attempts: 10, delay: 2e4, }),
        MERGE: Object.freeze({ token: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833', promo: 'dc128d28-c45b-411c-98ff-ac7726fbaea4', attempts: 10, delay: 2e4, }),
        TWERK: Object.freeze({ token: '61308365-9d16-4040-8bb0-2f4a4c69074c', promo: '61308365-9d16-4040-8bb0-2f4a4c69074c', attempts: 10, delay: 2e4, }),
        POLYSPHERE: Object.freeze({ token: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71', promo: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71', attempts: 22, delay: 2e4 }),
        MUDRACE: Object.freeze({ token: '8814a785-97fb-4177-9193-ca4180ff9da8', promo: '8814a785-97fb-4177-9193-ca4180ff9da8', attempts: 20, delay: 2e4 }),
        MOWTRIM: Object.freeze({ token: 'ef319a80-949a-492e-8ee0-424fb5fc20a6', promo: 'ef319a80-949a-492e-8ee0-424fb5fc20a6', attempts: 20, delay: 2e4 }),
        CAFE: Object.freeze({ token: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11', promo: 'bc0971b8-04df-4e72-8a3e-ec4dc663cd11', attempts: 20, delay: 2e4 }),
        ZOOPOLIS: Object.freeze({ token: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b', promo: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b', attempts: 20, delay: 2e4 }),
        GANGWARS: Object.freeze({ token: 'b6de60a0-e030-48bb-a551-548372493523', promo: 'c7821fa7-6632-482c-9635-2bd5798585f9', attempts: 30, delay: 4e4 }),
        TILETRIO: Object.freeze({ token: 'e68b39d2-4880-4a31-b3aa-0393e7df10c7', promo: 'e68b39d2-4880-4a31-b3aa-0393e7df10c7', attempts: 20, delay: 2e4 }),
        FLUFFCRUSADE: Object.freeze({ token: '112887b0-a8af-4eb2-ac63-d82df78283d9', promo: '112887b0-a8af-4eb2-ac63-d82df78283d9', attempts: 10, delay: 4e4 }),
        STONEAGE: Object.freeze({ token: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af', promo: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af', attempts: 20, delay: 2e4 }),
        BOUNCE: Object.freeze({ token: 'bc72d3b9-8e91-4884-9c33-f72482f0db37', promo: 'bc72d3b9-8e91-4884-9c33-f72482f0db37', attempts: 10, delay: 2e4 }),
        HIDEBALL: Object.freeze({ token: '4bf4966c-4d22-439b-8ff2-dc5ebca1a600', promo: '4bf4966c-4d22-439b-8ff2-dc5ebca1a600', attempts: 20, delay: 3e4 }),
        PINOUT: Object.freeze({ token: 'd2378baf-d617-417a-9d99-d685824335f0', promo: 'd2378baf-d617-417a-9d99-d685824335f0', attempts: 20, delay: 4e4 }),
        COUNT: Object.freeze({ token: '4bdc17da-2601-449b-948e-f8c7bd376553', promo: '4bdc17da-2601-449b-948e-f8c7bd376553', attempts: 20, delay: 4e4 }),
        INFCT: Object.freeze({ token: 'eb518c4b-e448-4065-9d33-06f3039f0fcb', promo: 'eb518c4b-e448-4065-9d33-06f3039f0fcb', attempts: 10, delay: 4e4 }),
        AMONG: Object.freeze({ token: 'daab8f83-8ea2-4ad0-8dd5-d33363129640', promo: 'daab8f83-8ea2-4ad0-8dd5-d33363129640', attempts: 10, delay: 4e4 }),
        FCTRY: Object.freeze({ token: 'd02fc404-8985-4305-87d8-32bd4e66bb16', promo: 'd02fc404-8985-4305-87d8-32bd4e66bb16', attempts: 10, delay: 4e4 }),
        SNAKE: Object.freeze({ token: 'c8e017e2-8817-4d02-bce6-b951e74bb18f', promo: 'c8e017e2-8817-4d02-bce6-b951e74bb18f', attempts: 30, delay: 2e4 }),
        COOKST: Object.freeze({ token: 'ed526e8c-e6c8-40fd-b72a-9e78ff6a2054', promo: 'ed526e8c-e6c8-40fd-b72a-9e78ff6a2054', attempts: 10, delay: 4e4 }),
    })
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
            // Inicar sesion
            const litem = document.createElement('li')
            litem.appendChild(document.createTextNode('Iniciando Sesion'));
            ul.appendChild(litem)
            const clientToken = await login(selectedGame, tokens[selectedGame]['token']);
            if (!clientToken) throw new Error(`[Login] Error -- No se ha iniciado sesion exitosamente`)
            litem.appendChild(document.createTextNode('...OK'));
            setProgressBar(15)

            // Registrar
            const lregister = document.createElement('li')
            lregister.appendChild(document.createTextNode('Registrando'))
            ul.appendChild(lregister)
            let r = null;
            let c = 0
            for (; !r && c < tokens[selectedGame]['attempts']; c++) {
                await sleep(tokens[selectedGame]['delay'] * delayRandom())
                r = await register(clientToken, tokens[selectedGame]['promo']);
                r ? lregister.appendChild(document.createTextNode('OK')) : lregister.appendChild(document.createTextNode('.'))
                ul.appendChild(lregister)
                setProgressBar(pBarPercentage + (70 / tokens[selectedGame]['attempts']))
            }
            if (c > tokens[selectedGame]['attempts']) throw new Error('[Register] Error -- Se ha superado el limite de intentos.')

            // Obtener
            const lcreate = document.createElement('li')
            const keyCode = await generate(clientToken, tokens[selectedGame]['promo']);
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

    const sleep = (time) => new Promise(r => setTimeout(r, time))

    const setProgressBar = (valor) => {
        pBarPercentage = valor
        pbar.style.width = `${valor}%`
        pBarText.innerHTML = `${roundTo(valor, 2)}%`
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
 */