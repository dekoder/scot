#!/usr/bin/env perl

use strict;
use warnings;
use lib '../lib';
use lib '../../lib';
use lib '../../Scot-Internal-Modules/lib';
use lib '/opt/scot/lib';
use v5.16;
use Scot::App::FedRec;
use Data::Dumper;

my $config_file = $ENV{'scot_app_flair_config_file'} //
                        '/opt/scot/etc/fedrec.cfg.pl';
my $env = Scot::Env->new(
    config_file => $config_file,
);

$SIG{__DIE__} = sub { our @reason = @_ };

END {
    our @reason;
    if (@reason) {
        say "$0 died because: @reason";
        $env->log->error("$0 died because: ",{filter=>\&Dumper, value=>\@reason});
    }
}




my $loop    = Scot::App::FedRec->new({ 
    env => $env,
});
$loop->run();

