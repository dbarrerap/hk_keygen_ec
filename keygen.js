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
    const imgContainer = document.querySelector('#imgContainer')
    const btnDebug = document.querySelector('#lbl_name')
    let pBarPercentage = 0;
    const { user } = window.Telegram.WebApp.initDataUnsafe

    if (user) document.querySelector('#lbl_name').textContent = `${user.first_name}`

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

    const apps = [
        {
            code: 'TRAIN', label: 'Train Miner', featured: false, enabled: false,
            token: '82647f43-3f87-402d-88dd-09a90025313f', promo: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
            attempts: 10, delay: 20e3,
        },
        {
            code: 'FCTRY', label: 'Factory World', featured: false, enabled: true,
            token: 'd02fc404-8985-4305-87d8-32bd4e66bb16', promo: 'd02fc404-8985-4305-87d8-32bd4e66bb16',
            attempts: 10, delay: 40e3,
        },
        {
            code: 'COUNT', label: 'Count Masters', featured: false, enabled: false,
            token: '4bdc17da-2601-449b-948e-f8c7bd376553', promo: '4bdc17da-2601-449b-948e-f8c7bd376553',
            attempts: 20, delay: 40e3,
        },
        {
            code: 'SNAKE', label: 'Snake Run', featured: false, enabled: false,
            token: 'c8e017e2-8817-4d02-bce6-b951e74bb18f', promo: 'c8e017e2-8817-4d02-bce6-b951e74bb18f',
            attempts: 30, delay: 20e3,
        },
        {
            code: 'MERGE', label: 'Merge Away', featured: true, enabled: true,
            token: '8d1cc2ad-e097-4b86-90ef-7a27e19fb833', promo: 'dc128d28-c45b-411c-98ff-ac7726fbaea4',
            attempts: 10, delay: 20e3,
        },
        {
            code: 'COOKST', label: 'Cooking Stories', featured: false, enabled: true,
            token: 'ed526e8c-e6c8-40fd-b72a-9e78ff6a2054', promo: 'ed526e8c-e6c8-40fd-b72a-9e78ff6a2054',
            attempts: 10, delay: 40e3,
        },
        {
            code: 'CUBE', label: 'Chain Cube 2048', featured: false, enabled: true,
            token: 'd1690a07-3780-4068-810f-9b5bbf2931b2', promo: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
            attempts: 10, delay: 20e3,
        },
        {
            code: 'INFCT', label: 'Infected Frontier', featured: false, enabled: false,
            token: 'eb518c4b-e448-4065-9d33-06f3039f0fcb', promo: 'eb518c4b-e448-4065-9d33-06f3039f0fcb',
            attempts: 10, delay: 40e3,
        },
        {
            code: 'BOUNCE', label: 'Bouncemasters', featured: false, enabled: true,
            token: 'bc72d3b9-8e91-4884-9c33-f72482f0db37', promo: 'bc72d3b9-8e91-4884-9c33-f72482f0db37',
            attempts: 10, delay: 20e3,
        },
        {
            code: 'POLYSPHERE', label: 'Polysphere', featured: false, enabled: true,
            token: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71', promo: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
            attempts: 22, delay: 20e3,
        },
        {
            code: 'ZOOPOLIS', label: 'Zoopolis', featured: false, enabled: true,
            token: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b', promo: 'b2436c89-e0aa-4aed-8046-9b0515e1c46b',
            attempts: 20, delay: 20e3,
        },
        {
            code: 'STONE', label: 'Stone Age', featured: false, enabled: false,
            token: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af', promo: '04ebd6de-69b7-43d1-9c4b-04a6ca3305af',
            attempts: 30, delay: 20e3,
        },
        {
            code: 'TOWER', label: 'Tower Defence', featured: false, enabled: false,
            token: '53bf823a-948c-48c4-8bd5-9c21903416df', promo: '53bf823a-948c-48c4-8bd5-9c21903416df',
            attempts: 10, delay: 20e3,
        },
        {
            code: 'DALE', label: 'Merge Dale', featured: true, enabled: true,
            token: '13f7bd7c-b4b3-41f1-9905-a7db2e814bff', promo: '13f7bd7c-b4b3-41f1-9905-a7db2e814bff',
            attempts: 10, delay: 22e3,
        },
        {
            code: 'MAGIC', label: 'Aftermagic', featured: false, enabled: false,
            token: 'e355f8c7-3764-49cd-a298-530d666435c3', promo: 'e355f8c7-3764-49cd-a298-530d666435c3',
            attempts: 10, delay: 20e3
        },
        {
            code: 'DOODLE', label: 'Doodle God', featured: true, enabled: true,
            token: 'e53b902b-d490-406f-9770-21a27fff1d31', promo: 'e53b902b-d490-406f-9770-21a27fff1d31',
            attempts: 10, delay: 20e3
        },
    ]

    apps.forEach(({ code, label, featured, enabled }) => {
        if (enabled) {
            const opt = document.createElement('option')
            opt.value = code
            opt.innerHTML = featured ? `★ ${label}` : label;
            if (featured) cmbSelectedGame.insertBefore(opt, cmbSelectedGame.children[1])
            else cmbSelectedGame.appendChild(opt)
        }
    })

    cmbSelectedGame.addEventListener('change', (event) => {
        const selectedGame = event.target.value
        showImage(selectedGame)
        generateCode(selectedGame)
    })

    btnDebug.addEventListener('click', () => {
        const stats = localStorage.getItem('stats')
        if (stats) {
            const { id, codes } = JSON.parse(stats)
            Swal.fire({ html: `<dl><dt>id</dt><dd>${id}</dd><dt>codes</dt><dd>${JSON.stringify(codes)}</dd></dl>` })
        } else {
            Swal.fire('No data', '', 'info')
        }
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

    const logRequest = (selectedGame) => {

        const prevStats = localStorage.getItem('stats')
        const stats = (prevStats) ? JSON.parse(prevStats) : { id: user.id, name: user.first_name, codes: {} }
        if (stats.codes[selectedGame]) stats.codes[selectedGame] += 1
        else stats.codes[selectedGame] = 1
        localStorage.setItem('stats', JSON.stringify(stats))
    }

    const generateCode = async (selectedGame) => {

        // Validar seleccion
        // console.log(selectedGame)
        if (selectedGame === '-- SELECT --') return

        // Housekeeping
        resetStorage()  // Check if first run
        clearMessages()
        txtCode.value = ''
        latchButtons(true)
        cmbSelectedGame.disabled = true
        setProgressBar(0)

        try {
            // Obtener data del juego seleccionado 
            const { token, promo, attempts, delay } = apps.find(g => g.code == selectedGame)
            // console.log(token, promo, attempts, delay)
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

            logRequest(selectedGame)

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

    const showImage = (selectedGame) => {
        if (selectedGame == '-- SELECT --') console.log('nothing')
        else imgContainer.setAttribute('src', `img/${selectedGame}.webp`)
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

    const resetStorage = () => {
        const firstRun = Boolean(localStorage.getItem('firstRun'))
        if (!firstRun) {
            localStorage.removeItem('stats')
            localStorage.setItem('firstRun', 'false')
        }
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
 * 1.3.0 Nuevo arreglo para hacer uso de una sola estructura de datos
 * 1.3.1 Se agregan propiedades para los juegos destacados y poder habilitar/deshabilitar.
 * 1.3.2 Nuevo juego: Tower Defense 
 * 1.3.2.1 Ajustes menores
 * 1.3.2.2 Registro de estadisticas
 * 1.3.3 Nuevo juego: Merge Dale
 * 1.3.4 Nuevo juego: Aftermagic
 * 1.3.5 Nuevo juego: Doodle God
 */