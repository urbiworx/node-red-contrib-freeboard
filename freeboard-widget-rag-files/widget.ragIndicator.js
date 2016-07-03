(function()
{
	//Our RAG indicator styles
	freeboard.addStyle('.rag-light', "border-radius:50%;width:22px;height:22px;border:2px solid #3d3d3d;margin-top:5px;float:left;background-color:#222;margin-right:10px;");
	freeboard.addStyle('.rag-light.red', "background-color:#D90000;box-shadow: 0px 0px 15px #D90000;border-color:#FDF1DF;");
	freeboard.addStyle('.rag-light.amber', "background-color:#E49B00;box-shadow: 0px 0px 15px #E49B00;border-color:#FDF1DF;");
	freeboard.addStyle('.rag-light.green', "background-color:#00B60E;box-shadow: 0px 0px 15px #00B60E;border-color:#FDF1DF;");
	freeboard.addStyle('.rag-text', "margin-top:10px;");
    //Flashing status for the light
	freeboard.addStyle('.red-flash', "animation: red-flash 500ms infinite alternate;")
	freeboard.addStyle('.amber-flash', "animation: amber-flash 500ms infinite alternate;")
	freeboard.addStyle('.green-flash', "animation: green-flash 500ms infinite alternate;")
	//Dim status for the light
	freeboard.addStyle('.dim', "opacity: 0.6;");
	
	var ragWidget = function (settings) {
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div class="rag-text"></div>');
        var indicatorElement = $('<div class="rag-light"></div>');
        var currentSettings = settings;
		
		//define our keyframes for our flashing lights
		$.keyframe.define([{
			name: 'green-flash',
			'0%': {'background-color': '#2A2A2A', 'box-shadow': '0px 0px 0px #2A2A2A'},
			'100%': {'background-color': '#00B60E', 'box-shadow': '0px 0px 15px #00B60E'}
		
		}]); 
		$.keyframe.define([{
			name: 'amber-flash',
			'0%': {'background-color': '#2A2A2A', 'box-shadow': '0px 0px 0px #2A2A2A'},
			'100%': {'background-color': '#E49B00', 'box-shadow': '0px 0px 15px #E49B00'}
		
		}]); 
		$.keyframe.define([{
			name: 'red-flash',
			'0%': {'background-color': '#2A2A2A', 'box-shadow': '0px 0px 0px #2A2A2A'},
			'100%': {'background-color': '#D90000', 'box-shadow': '0px 0px 15px #D90000'}
		
		}]); 
		
		//store our calculated values in an object
		var stateObject = {};
		
		//array of our values: 0=Green, 2=Amber, 3=Red
		var stateArray = ["green", "amber", "red"];
        
		function updateState() {         
		
			//Remove all classes from our indicator light
			indicatorElement
				.removeClass('red')
				.removeClass('amber')					
				.removeClass('green')	
				.removeClass('green-flash')
				.removeClass('amber-flash')
				.removeClass('red-flash')
				.removeClass('dim')
			
			var ragValue = _.isUndefined(stateObject.value) ? -1 : stateObject.value;			
			//If we have a valid value set, continue
			if (stateArray[stateObject.value]) {
				indicatorElement.addClass(stateArray[stateObject.value]);
				var indicatorText = stateArray[stateObject.value] + '_text';
				//Get our Indicator Type
				stateElement.html((_.isUndefined(stateObject[indicatorText]) ? "" : stateObject[indicatorText]));
				var indicatorType = (_.isUndefined(stateObject.indicator_type) ? "" : stateObject.indicator_type.toLowerCase());
				
				switch (indicatorType) {
					case 'dim' : 
						indicatorElement.addClass('dim');
						break;
					case 'flash' :
						var indicatorTypeClass = stateArray[stateObject.value] + '-flash';
						indicatorElement.addClass(indicatorTypeClass);				
						break;
					default:
						//this is normal					
				}								
			} else {
				//stateElement.html('Error');
			}
		
        }

        this.render = function (element) {
            $(element).append(titleElement).append(indicatorElement).append(stateElement);			
        }		

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            //whenever a calculated value changes, store them in the variable 'stateObject'
			stateObject[settingName] = newValue;
            updateState();
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 1;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin({
        type_name: "ragIndicator",
        display_name: "RAG Indicator",
		external_scripts: [
			"plugins/thirdparty/jquery.keyframes.min.js"
		],
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "value",
                display_name: "Value (G=0, A=1, R=2)",
                type: "calculated"
            },
			{
                name: "green_text",
                display_name: "Green Text",
                type: "calculated"
            },            
            {
                name: "amber_text",
                display_name: "Amber Text",
                type: "calculated"
            },
			{
                name: "red_text",
                display_name: "Red Text",
                type: "calculated"
            },
			{
                name: "indicator_type",
                display_name: "Type (Normal, Dim, Flash)",
                type: "calculated"
            }
            
			
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new ragWidget(settings));
        }
    });
}());	
