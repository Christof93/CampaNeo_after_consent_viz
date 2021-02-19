files := $(filter-out paper.tex paper.bib, $(wildcard paper.*))

all: pdf

.PHONY: pdf
pdf:
	tectonic --reruns 1 paper.tex

.PHONY: clean
clean: $(files)
	rm $(files)

