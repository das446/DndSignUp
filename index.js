var limit = 2;
var checked = 0;
var lastChecked;
var responses = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq-VvSWdFfxXMpv3Un9wPzYN9pVlycVJOK1P8zUeaGvs-rTE0iyBTB8_SXsQnzg0eeekgTBIEctBMZ/pub?output=csv";


var campaigns = [];

var csv;

function SetCampaigns() {

    var proxyurl = "https://cors-anywhere.herokuapp.com/";
    $.ajax({
        type: "GET",
        url: proxyurl + responses,
        dataType: "text",
        success: function(data) {
            csv = Papa.parse(data);
            $.ajax({
                type: "GET",
                url: "AGO_One-Shot_Saturday.csv",
                dataType: "text",
                success: function(data) {
                    processData(data, csv);
                    MakeCheckBoxes();
                    SetCheckBoxes();
                }
            });
        }
    });




    function ParseGoogleForm(csv) {
        var indexes = [];

        var header = csv.data[0];

        for (var i = 0; i < header.length; i++) {
            var cell = header[i];
            if (cell.includes("[") && cell.includes("]")) {
                var sub = cell.substring(
                    cell.lastIndexOf("[") + 1,
                    cell.lastIndexOf("]")
                );
                indexes.push({
                    name: sub,
                    col: i
                })
            }
        }

        return indexes;
    }




    function processData(csv, form) {

        var indexes = ParseGoogleForm(form);

        csv = csv.replace("");
        var allTextLines = csv.split("!!");
        var headers = allTextLines[0].split('|');

        for (var i = 1; i < allTextLines.length - 1; i++) {
            var data = allTextLines[i].split('|');

            var campaign = {};
            campaign.time = data[0];
            campaign.name = data[1];
            campaign.dm = data[2];
            campaign.img = data[3];
            campaign.cur = GetCurAmnt(indexes, i - 1, form);
            campaign.max = 5
            campaign.description = data[4];
            campaigns.push(campaign);

        }
    }

    function GetCurAmnt(indexes, i, csv) {
        var amnt = 0;
        var n = indexes[i].col;
        for (var j = 1; j < csv.data.length; j++) {
            var cell = csv.data[j][n];
            if (cell == "1") {
                amnt++;
                if (amnt > 5) {
                    amnt = 5;
                }
            }
        }
        return amnt;
    }

    function MakeCheckBoxes() {
        var list = $("#campaigns");
        for (var i = 0; i < campaigns.length; i++) {
            var c = campaigns[i];
            var id = c.name + " @" + c.time;
            //<li><input type="checkbox" class="campaign" id="kamal" name="campaign" value="kamal">Kamal's Kewl Kampaign</li>
            var li = $('<li></li>')
            var div = $('<div class="campaign" id="kamal"><div class = "campaign_id">' + c.name + '</div><div id="campaign_time"> @ ' + c.time + " " + c.cur + "/" + c.max + ' spots filled</div></div>');
            div.attr('id', id);
            div.attr('value', id);
            div.attr('index', i);
            li.append(div);
            list.append(li);
        }
    }

setTimeout(function(){ $("#loading").remove()},1000);


}


function SetCheckBoxes() {

    var lis = $('.campaign_id');
    lis.hover(function(evt) {
        var box = $(this);

        var campaign = campaigns[box.parent().attr('index')];

        $("#DM").text("GM'd by: " + campaign.dm);
        $("#Name").text(campaign.name);
        $("#summary").html(campaign.description);
        $("#logo").attr("src", "Images/" + campaign.img);

    });
};
