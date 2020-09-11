document.addEventListener("DOMContentLoaded", function (event) {
    console.log("Hi developers!")

    /* let now = new Date().getFullYear();
    for (let i = 0; i <= 120; i++) {
        $("#cf_date-year").append(`<option>` + (now - i) + `</option>`)
    }
    for (let i = 1; i <= 31; i++) {
        $("#cf_date-day").append(`<option>` + i + `</option>`)
    } */

    new ClipboardJS('#cf_code');

    if (Cookies.get('cf')) {
        let cf_obj = JSON.parse(Cookies.get('cf'));
        console.log(cf_obj)
        $("#cf_form").hide()
        $(".cf_card-body").append(`
            <div class="text-center" id="cf_result">
                <h2 class="cf_h2" id="cf_code" data-clipboard-text=` + cf_obj.cf + `>Il tuo codice fiscale è <b id="cf_tooltip" data-toggle="tooltip" data-placement="top" style="color: #2eb960">` + cf_obj.cf + `</b></h2>
                <button type="click" class="btn btn-primary cf_btn mt-2" id="cf_btn-restart">Ricalcola</button>
            </div>
        `)

        $("#cf_code").click(function(){
            $("#cf_tooltip").attr("data-original-title", "Copiato!")
            $('#cf_tooltip').tooltip('show')
            setTimeout(function(){
                $("#cf_tooltip").attr("data-original-title", "")
                $('#cf_tooltip').tooltip('hide')
            }, 800)
        })

        $("#cf_btn-restart").click(function () {
            Cookies.set('cf', '')
            $("#cf_form")[0].reset();
            $("#cf_result").remove()
            $("#cf_form").show()
        })
    }

    let user = {}

    $("#cf_form").submit(function (e) {
        e.preventDefault()

        let date_split = $("#cf_date").val().split("-");
        let year = parseInt(date_split[0])
        let month = parseInt(date_split[1])
        let day = parseInt(date_split[2])

        user = {
            "name": $("#cf_name").val(),
            "surname": $("#cf_surname").val(),
            "gender": $("#cf_gender").val(),
            "day": day,
            "month": month,
            "year": year,
            "birthplace": $("#cf_place").val(),
            "birthplaceProvincia": $("#cf_place-tag").val().toUpperCase()
        }
        console.log(user)
        let cf = new CodiceFiscale(user);
        Cookies.set('cf', cf)

        $("#cf_form").hide()
        $(".cf_card-body").append(`
            <div class="text-center" id="cf_result">
                <h2 class="cf_h2" id="cf_code" data-toggle="tooltip" title="Some tooltip text!" data-clipboard-text=` + cf.code + `>Il tuo codice fiscale è <b style="color: #2eb960">` + cf.code + `</b></h2>
                <button type="click" class="btn btn-primary cf_btn mt-2" id="cf_btn-back">Indietro</button>
                <button type="click" class="btn btn-primary cf_btn mt-2" id="cf_btn-restart">Ricalcola</button>
            </div>
        `)

        $("#cf_code").click(function () {
            $("#cf_code").select()
            $("#cf_code").setSelectionRange(0, 99999)
            document.execCommand('copy')
        })

        $("#cf_btn-back").click(function () {
            $("#cf_form").show()
            $("#cf_result").remove()
        })

        $("#cf_btn-restart").click(function () {
            Cookies.set('cf', '')
            $("#cf_form")[0].reset();
            $("#cf_result").remove()
            $("#cf_form").show()
        })
    })
})