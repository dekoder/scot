%environment = (
    time_zone   => 'America/Denver',
    max_workers => 1,
    log_config  => {
        logger_name     => 'SCOT',
        layout          => '%d %7p [%P] %15F{1}: %4L %m%n',
        appender_name   => 'scot_log',
        logfile         => '/var/log/scot/scot.stretch.log',
        log_level       => 'DEBUG',
    },
    default_owner   => 'scot-admin',
    stomp_host  => "activemq",
    stomp_port  => 61613,
    modules => [
        {
            attr    => 'es',
            class   => 'Scot::Util::ElasticSearch',
            config  => {
                nodes   => [ qw(172.18.0.5:9200) ],
            },
        },
        {
            attr    => 'scot',
            class   => 'Scot::Util::ScotClient',
            config  => {
                servername  => "scot",
                username    => "scot-alerts",
                password    => "changemenow",
                auth_type    => "basic",
            },
        },
        {
            attr    => 'mongo',
            class   => 'Scot::Util::MongoFactory',
            config  => {
                db_name         => 'scot-prod',
                host            => 'mongodb://mongodb',
                write_safety    => 1,
                find_master     => 1,
            },
        },
    ],
);