WEBPACK = npx webpack

MODE =
ifeq ($(CONFIGURATION), Debug)
MODE = --mode development
endif
ifeq ($(CONFIGURATION), Release)
MODE = --mode production
endif

all:
	@echo $(PATH)
	$(WEBPACK) $(MODE)
