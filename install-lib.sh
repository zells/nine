mkdir -p static/lib

curl https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css --output static/lib/bulma.css
curl https://jenil.github.io/bulmaswatch/superhero/bulmaswatch.min.css --output static/lib/bulma-superhero.css

curl https://code.jquery.com/jquery-3.4.0.min.js --output static/lib/jquery.js
curl https://code.jquery.com/ui/1.12.1/jquery-ui.min.js --output static/lib/jquery-ui.js
curl https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css --output static/lib/jquery-ui.css
curl https://raw.githubusercontent.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js --output static/lib/touch-punch.js

curl https://raw.githubusercontent.com/ivkremer/jquery-simple-combobox/master/js/jquery.scombobox.min.js --output static/lib/combobox.js
curl https://github.com/ivkremer/jquery-simple-combobox/blob/master/css/jquery.scombobox.min.css --output static/lib/combobox.css