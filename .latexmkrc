$xelatex = 'xelatex -shell-escape -synctex=1 -interaction=nonstopmode %O %S';
$pdf_mode = 5;

push @generated_exts, 'run.xml';
push @generated_exts, 'nav';
push @generated_exts, 'snm';

$bibtex_use = 2;

@default_files = (
  'paper.tex',
)
