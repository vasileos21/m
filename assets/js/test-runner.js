// functia de incarcare a testelor
const testLoader = (test, cb) => {
    $.getJSON(`tests/${test}.json`, cb)
        .fail(() => {
            alert(`Nu am putut incarca testul aferent fiierului ${test}.json`)
        })
}

// functia ce intoarce indexul unui element
const getIndex = chkId => parseInt(chkId.split('-').pop()) + 1

const setValid = target => target.addClass('valid-variant')

const setInvalid = target => target.addClass('invalid-variant')

// utilitar ce determina daca doi vectori au aceleasi elemente componente
const arraysEqual = (_arr1, _arr2) => {

    if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length)
        return false

    const arr1 = _arr1.concat().sort()
    const arr2 = _arr2.concat().sort()

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false
    }
    return true
}

// functia de generare a codului html corespunzator fiecarui test
const generateQSet = (target, q) => {
    const variants = (target, vText, qID, vId) => {
        target.before(`<li>
                <div class="variant-container">
                    <div>
                        <label for="vname-${qID}-${vId}">V${vId + 1}</label>
                        <input 
                            type="checkbox" 
                            class="vcheck-${qID}"
                            value="None" 
                            id="vcheck-${qID}-${vId}" 
                            name="vname-${qID}-${vId}"/>
                    </div>
                    <div class="vtext" id="vtext-${qID}-${vId}">${vText}</div>
                </div>
            </li>`)
    }

    q.forEach(
        (qSet, qId) => {
            target.before(`
                <h4>Subiectul ${qId + 1}</h4>
                <div class="reveal-area" id="ra-${qId}"></div>
                <p>${qSet['q']}</p>
            `)
            qSet['v'].forEach(
                (vText, vId) => {
                    variants(target, vText, qId, vId)
                }
            )
        }
    )
}
// functia ce evaluaeaza corectitudinea raspunsului pentru un test
const evaluateQ = (q, qId) => {

    const checked = $(`.vcheck-${qId}:checked`)

    // If no valid answers return  valid if all unchecked
    if (!q['r'].length) {
        return checked.length === 0
    }

    // If there are valid answers but no checked ones return invalid question
    if (!checked.length) return false

    // If only one answer is valid check if the checked one
    if (q['r'].length === 1) {
        let checkedId = checked.get(0).id
        return getIndex(checkedId) === q['r'][0]
    }

    // If multiple valid answers check if the checked ones are the valid ones
    let checkedId = checked.map(function () {
        return getIndex(this.id)
    }).toArray()
    return arraysEqual(q['r'], checkedId)
}

// functia care intoarce numarul de raspunsuri corecte obtinute
const evaluateQSet = qData =>
    qData.filter(
        (q, qId) => evaluateQ(q, qId)
    ).length

// functia ce afiseaza raspunsul corect pentru un o intrebare
const revealQ = (q, qId) => {
    $(`.vcheck-${qId}`).map(
        function () {
            const vId = getIndex(this.id) - 1
            const target = $(`#vtext-${qId}-${vId}`).get(0)
            if (q['r'].includes(vId + 1)) {
                if (this.checked) setValid($(target))
                else setInvalid($(target))
            } else if (this.checked) {
                setInvalid($(target))
            }
        })
}

// functia ce afiseaza raspunsul corect pentru un test
const revealQSet = qData => {
    qData.map(
        (q, qId) => {
            const revealArea = $(`#ra-${qId}`)
            let rez = ''
            if(!q['r'].length) rez='Nici o varianta din cele enumerate nu este corecta.'
            else if(q['r'].length === 1) rez = `Varianta corecta este: V${q['r'][0]}`
            else rez = `Variantele corecte sunt: ${q['r'].map(r => 'V' + r.toString()).join(', ')}.`
            revealArea.text(rez)
            revealQ(q, qId)
        }
    )
}

// functia de activare a butonului "Reseteaza"
const setResetListener = () => {
    $('button#reset-qtest').on('click', () => {
        $('input[type=checkbox]').prop('checked', false)
        $('.vtext')
            .removeClass('valid-variant')
            .removeClass('invalid-variant')
    })
}

// functia de activare a butonului "Evalueaza"
const setEvaluateListener = qData => {
    $('button#evaluate-qtest').on('click', () => {
        $('div.qtest').text(
            `Ati raspuns corect la ${evaluateQSet(qData)} din ${qData.length} intrebari.`
        )
    })
}

// functia de activare a butonului "Afiseaza solutia"
const setRevealListener = qData => {
    $('button#reveal-qtest').on('click', () => {
        revealQSet(qData)
    })
}