#!/usr/bin/env perl

# Develop daemon script 

# [Usage] (Required: perl-5.10.1 or later)
# Run:
# $ cpan Mojolicious
# $ perl daemon.pl
# 
# Then, access to: http://localhost:3000/index.html

use Mojolicious::Lite;
push @{app->static->paths}, 'site/';
app->start('daemon');

