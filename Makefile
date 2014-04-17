LESSC = ./node_modules/.bin/lessc

static/style/layout.css: static/style/layout.less
	$(LESSC) -x $^ > $@
