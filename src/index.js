document.addEventListener("DOMContentLoaded", function (event) {
    console.log("Hi developers!")

    /* let now = new Date().getFullYear();
    for (let i = 0; i <= 120; i++) {
        $("#cf_date-year").append('<option>' + (now - i) + '</option>')
    }
    for (let i = 1; i <= 31; i++) {
        $("#cf_date-day").append('<option>' + i + '</option>')
    } */

    new ClipboardJS('#cf_code');

    if (Cookies.get('cf')) {
        let cf_obj = JSON.parse(Cookies.get('cf'));
        console.log(cf_obj)
        $("#cf_form").hide()
        $("#cf_normal-card-body").append('<div class="text-center" id="cf_result"><h2 class="cf_h2" id="cf_code" data-clipboard-text=' + cf_obj.cf + '>Il tuo codice fiscale è <b id="cf_tooltip" data-toggle="tooltip" data-placement="top" style="color: #2eb960">' + cf_obj.cf + '</b></h2><button type="click" class="btn btn-primary cf_btn mt-2" id="cf_btn-restart">Ricalcola</button></div>')

        $("#cf_code").click(function () {
            $("#cf_tooltip").attr("data-original-title", "Copiato!")
            $('#cf_tooltip').tooltip('show')
            setTimeout(function () {
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

    // for IE11
    if (navigator.userAgent.indexOf('Trident/') > 0) {
        $("#cf_date-label").text("Data di nascita (yyyy-gg-mm)")
    }

    // autocomplete city
    var substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            substringRegex = new RegExp(q, 'i');

            $.each(strs, function (i, str) {
                if (str.toLowerCase() == $("#cf_place").val().toLowerCase()) {
                    matches.push(str);
                }
            });

            $.each(strs, function (i, str) {
                if (substringRegex.test(str) && str.toLowerCase().startsWith($("#cf_place").val().toLowerCase())) {
                    matches.push(str);
                }
            });

            $.each(strs, function (i, str) {
                if (substringRegex.test(str) && !str.toLowerCase().startsWith($("#cf_place").val().toLowerCase())) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };
    $('.typeahead').typeahead({
        hint: false,
        highlight: true,
        minLength: 1
    },
        {
            limit: 1000,
            name: 'cities',
            source: substringMatcher(cities)
        })

    let user = {}
    let inputcheck
    $("#cf_place").change(function () {
        $(".cf_error").remove()
        cities.forEach(element => {
            if (element.toLowerCase() == $('#cf_place').val().toLowerCase()) {
                inputcheck = true
            }
        });
        if (inputcheck) {
            $(".cf_error").remove()
            inputcheck = false
        } else {
            $(".cf_card-body").append('<p class="cf_label cf_error">Inserisci una provincia e una sigla valida</p>')
        }
    })

    $("#cf_form").submit(function (e) {
        e.preventDefault()

        let date_split = $("#cf_date").val().split("-");
        let year = parseInt(date_split[0])
        let month = parseInt(date_split[1])
        let day = parseInt(date_split[2])

        if ($("#cf_place-tag").val() == "") {
            user = {
                "name": $("#cf_name").val(),
                "surname": $("#cf_surname").val(),
                "gender": $("#cf_gender").val(),
                "day": day,
                "month": month,
                "year": year,
                "birthplace": $("#cf_place").val()
            }
        } else {
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
        }

        let cf = new CodiceFiscale(user);
        Cookies.set('cf', cf)

        $("#cf_form").hide()
        $("#cf_normal-card-body").append('<div class="text-center" id="cf_result"><h2 class="cf_h2" id="cf_code" data-clipboard-text=' + cf.code + '>Il tuo codice fiscale è <b id="cf_tooltip" data-toggle="tooltip" data-placement="top" style="color: #2eb960">' + cf.code + '</b></h2><button type="click" class="btn btn-primary cf_btn mt-2 mr-2" id="cf_btn-back">Indietro</button><button type="click" class="btn btn-primary cf_btn mt-2" id="cf_btn-restart">Ricalcola</button></div>')

        $("#cf_code").click(function () {
            $("#cf_tooltip").attr("data-original-title", "Copiato!")
            $('#cf_tooltip').tooltip('show')
            setTimeout(function () {
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

        $("#cf_btn-back").click(function () {
            $("#cf_form").show()
            $("#cf_result").remove()
        })

        return false;
    })

    $("#cf_reverse-card").hide()
    $("#cf_normal-btn").hide()
    $("#cf_reverse-btn").click(function () {
        $("#cf_reverse-card").show()
        $("#cf_reverse-btn").hide()
        $("#cf_normal-card").hide()
        $("#cf_normal-btn").show()
    })
    $("#cf_normal-btn").click(function () {
        $("#cf_reverse-card").hide()
        $("#cf_reverse-btn").show()
        $("#cf_normal-card").show()
        $("#cf_normal-btn").hide()
    })


    $("#cf_reverse-form").submit(function (e) {
        e.preventDefault()

        let cf = new CodiceFiscale($("#cf_reverse").val());
        console.log(cf.toJSON());
        let data = cf.toJSON()

        $("#cf_reverse-form").hide()
        $("#cf_reverse-card-body").append('<div class="container p-0" id="cf_reverse-result"><div class="row"><div class="col-md-6"><h3 class="cf_h3">Codice Fiscale</h3><p class="cf_p">' + data.cf + '</p><h3 class="cf_h3">Nome</h3><p class="cf_p">' + data.name + '</p><h3 class="cf_h3">Cognome</h3><p class="cf_p">' + data.surname + '</p></div><div class="col-md-6"><h3 class="cf_h3">Sesso</h3><p class="cf_p">' + data.gender + '</p><h3 class="cf_h3">Data di nascita</h3><p class="cf_p">' + data.day + '/' + data.month + '/' + data.year + '</p><h3 class="cf_h3">Città di nascita</h3><p class="cf_p">' + data.birthplace + ' (' + data.birthplaceProvincia + ')</p><button type="click" class="btn btn-primary float-right cf_btn mt-2" id="cf_reverse-btn-restart">Ricalcola</button></div></div></div>')

        $("#cf_reverse-btn-restart").click(function () {
            $("#cf_reverse-form")[0].reset()
            $("#cf_reverse-result").remove()
            $("#cf_reverse-form").show()
        })
    })
})