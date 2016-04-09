<%@ Page Language="C#" AutoEventWireup="true" Async="true" CodeBehind="Default.aspx.cs" Inherits="WebSite.Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>ReVision WebUI</title>

    <link href='//fonts.googleapis.com/css?family=Roboto+Slab:400,700' rel='stylesheet'>
    
    <link rel="stylesheet" href="http://cdn.kendostatic.com/2016.1.226/styles/kendo.common.min.css" />
    <link rel="stylesheet" href="http://cdn.kendostatic.com/2016.1.226/styles/kendo.metro.min.css" />
    <link rel="stylesheet" href="http://cdn.kendostatic.com/2016.1.226/styles/kendo.dataviz.min.css" />
    <link rel="stylesheet" href="http://cdn.kendostatic.com/2016.1.226/styles/kendo.dataviz.default.min.css" />
    <link rel="stylesheet" href="css/skin-win8/ui.fancytree.css" />
    <link rel="stylesheet" href="css/kendo.web.plugins.css" /> 
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" />
    <link rel="stylesheet" href="http://demo.qooxdoo.org/5.0.1/framework/indigo-5.0.1.css" />
    
    <script type="text/javascript" src="./scripts/json-recursive.js"></script>
    <script type="text/javascript" src="./scripts/jquery-2.2.2.js"></script>
    <script type="text/javascript" src="./scripts/jquery-ui-1.11.4.js"></script>
    <script type="text/javascript" src="http://cdn.kendostatic.com/2016.1.226/js/kendo.all.min.js"></script>
    <script type="text/javascript" src="./scripts/kendo/kendo.web.plugins.js"></script>
    <script type="text/javascript" src="./scripts/fancytree/jquery.fancytree-all.js"></script>
    <script type="text/javascript" src="http://demo.qooxdoo.org/5.0.1/framework/q-5.0.1.js"></script>


    <script src="./bridge/output/bridge.js"></script>
    <script src="./bridge/output/system.js"></script>
    <script src="./bridge/output/reVision.jSForms.baseClasses.js"></script>
    <script src="./bridge/output/system.collections.specialized.js"></script>
    <script src="./bridge/output/system.drawing.js"></script>
    <script src="./bridge/output/system.windows.forms.js"></script>
    <script src="./bridge/output/ReVision.JSForms.js"></script>

    <!--<script type="text/javascript" src="./scripts/script.js"></script>-->
    <style>
        .hover { background-color: Highlight; color: HighlightText; }
    </style>
</head>
<body style="margin: 0px; font-family:'Microsoft Sans Serif'; font-size:11px; overflow:hidden">
    <span id="notification" style="display:none;"></span>
    <script id="errorTemplate" type="text/x-kendo-template">
                <div class="wrong-pass" stye="z-index:1000">
                    <img src="../resources/images/error-icon.png" />
                    <h3>#= title #</h3>
                    <p>#= message #</p>
                </div>
    </script>
</body>
</html>