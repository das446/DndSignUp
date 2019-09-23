var limit = 2;
var checked = 0;
var lastChecked;


var campaigns = [];

function SetCampaigns() {

    $.ajax({
        type: "GET",
        url: "AGO_One-Shot_Saturday.csv",
        dataType: "text",
        success: function(data) {
            processData(data);
            MakeCheckBoxes();
            SetCheckBoxes();
        }
    });

    function processData(allText) {
        allText = allText.replace("");
        var allTextLines = allText.split("!!");
        var headers = allTextLines[0].split('|');

        for (var i = 1; i < allTextLines.length - 1; i++) {
            var data = allTextLines[i].split('|');

            var campaign = {};
            campaign.time = data[0];
            campaign.name = data[1];
            campaign.dm = data[2];
            campaign.img = data[3];
            campaign.description = data[4];
            campaigns.push(campaign);

        }
        console.log(campaigns);
    }

    function MakeCheckBoxes() {
        var list = $("#campaigns");
        for (var i = 0; i < campaigns.length; i++) {
            var c = campaigns[i];
            var id = c.name + " @" + c.time;
            //<li><input type="checkbox" class="campaign" id="kamal" name="campaign" value="kamal">Kamal's Kewl Kampaign</li>
            var li = $('<li></li>')
            var div = $('<div class="campaign" id="kamal" name="campaign" value="kamal">' + id + '</div>');
            div.attr('id', id);
            div.attr('value', id);
            div.attr('index', i);
            li.append(div);
            list.append(li);
        }
    }


}


function SetCheckBoxes() {

    var lis = $('.campaign');
    lis.click(function(evt) {
        var box = $(this);
        console.log(box.attr('id'));
        if (box.prop("checked")) {
            checked++;
        } else {
            checked--;
        }
        if (checked > 2) {
            lastChecked.prop("checked", false);
            checked = 2;
        }
        lastChecked = box;

        var campaign = campaigns[box.attr('index')];

        $("#DM").text(campaign.dm);
        $("#Name").text(campaign.name);
        $("#summary").text(campaign.description);
        $("#logo").attr("src", "Images/" + campaign.img);


    });
};