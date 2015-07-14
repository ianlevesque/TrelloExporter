$(function() {
    var onAuthorize = function() {
        updateLoggedIn();
        $("#output").empty();

        Trello.members.get("me", function(member){
            $("#fullName").text(member.fullName);

            var $lists = $("<div>")
                .text("Reticulating splines...")
                .appendTo("#output");

            Trello.get("boards/" + boardId + "/lists", function(lists) {
                Trello.get("boards/" + boardId + "/cards?members=true", function(cards) {
                    console.log(cards);
                    $lists.empty();

                    $.each(lists, function(ix, list) {
                        if(list.name.match(/Released/)) {
                            $("<h3>")
                                .text(list.name)
                                .appendTo($lists);

                            var $cards = $("<div>");

                            $cards.appendTo($lists);

                            $.each(cards, function (iy, card) {
                                if (card.idList === list.id) {
                                    var $cardInfo = $("<p>");

                                    $("<span>")
                                        .text(card.name)
                                        .appendTo($cardInfo);

                                    $.each(card.members, function(ix, member) {
                                        $("<span>")
                                            .text(" (" + member.fullName + ")")
                                            .appendTo($cardInfo);
                                    });

                                    $("<br>")
                                        .appendTo($cardInfo);

                                    $("<a>")
                                        .attr({href: card.shortUrl, target: "trello"})
                                        .text(card.shortUrl)
                                        .appendTo($cardInfo);

                                    $("<br>")
                                        .appendTo($cardInfo);

                                    $cardInfo.appendTo($cards);
                                }
                            });
                        }
                    });
                });
            });
        });
    };

    var updateLoggedIn = function() {
        var isLoggedIn = Trello.authorized();
        $("#loggedout").toggle(!isLoggedIn);
        $("#loggedin").toggle(isLoggedIn);
    };

    var logout = function() {
        Trello.deauthorize();
        updateLoggedIn();
    };

    Trello.authorize({
        interactive: false,
        success: onAuthorize
    });

    $("#connectLink")
        .click(function(){
            Trello.authorize({
                type: "popup",
                success: onAuthorize
            })
        });

    $("#disconnect").click(logout);
});




