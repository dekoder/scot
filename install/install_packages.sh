#!/bin/bash

function install_ubuntu_packages {

    DEBPACKAGES='
        curl
        make
        groff
        dialog
        gcc
        lynx
        libgssapi-krb5-2
        libkrb5support0
        libkrb5-3
        krb5-doc
        libimlib2-dev
        libimlib2
        libmagic-dev
        libmagic1
        apache2
        apache2-utils
    '
    # for some reason, maxmind ppa is foobar'ed and these packages
    # won't install unless we force them to with allow unauth
    FORCE='
        libgeoip-dev
        libmaxminddb0
        libmaxminddb-dev
        mmdb-bin
    '

    if [[ $REFRESHREPOS == "yes" ]]; then
        echo "-- refreshing apt repositories"
        apt-get-update
        if [[ $? != 0 ]]; then
            echo "!! Error refreshing apt repository !!"
            exit 3
        fi
    fi

    for pkg in $DEBPACKAGES; do
        echo ""
        echo "-- Installing $pgk"
        apt-get -y install $pkg
    done

    for pkg in $FORCE; do
        echo ""
        echo "-- force installing $pkg"
        apt-get -y --allow-unauthenticated install $pkg
    done
}

function update_apt {

    echo "--"
    echo "-- adding ppa's and updating"
    echo "--"

    echo "- reinstalling ca-certificates"
    apt-get install --reinstall ca-certificates
    apt-get install -y software-properties-common

    UBUNTUNAME="trusty"
    if [[ $OSVERSION == "16" ]]; then
        UBUNTUNAME="xenial"
    fi

    if grep --quiet maxmind /etc/apt/sources.list; then
        echo "- maxmind ppa already present"
    else
        echo "- trying to add maxmind ppa"
        #add-apt-repository ppa:maxmind/ppa
        #if [[ "$?" == "0" ]]; then
        #    echo "- miracles never cease, ppa added."
        #else
            UBUNAME="trusty"
            if [[ $OSVERSION == "16" ]]; then
                UBUNAME="xenial"
            fi
            Line="deb http://ppa.launchpad.net/maxmind/ppa/ubuntu $UBUNAME main"
            echo "- trying to add repo $Line"
            add-apt-repository "$Line"
        #fi
    fi

    apt-get update
}

function manually_build_libmaxmind {
    LIBMMVER="libmaxminddb-1.2.0"
    LIBMMDB="libmaxminddb-1.2.0.tar.gz"
    LIBMMRELEASE="releases/download/1.2.0"
    LIBMMURL="https://github.com/maxmind/libmaxminddb/$LIBMMRELEASE/$LIBMM"
    wget -P /tmp $LIBMMURL

    if [[ ! -e "/tmp/$LIBMMDB" ]]; then
        echo "-- download may have failed.  Using packaged tar file"
        cp $DEVDIR/install/src/maxmind/$LIBMMDB /tmp
    fi

    echo "-- extracting libmaxminddb source files"
    tar xf /tmp/$LIBMMDB --directory /tmp

    echo "-- changing to /tmp/$LIBMMVER to compile"
    cd /tmp/$LIBMMVER
    ./configure
    make 
    make install

    echo "-- changing dir back to $DEVDIR"
    cd $DEVDIR
}


function install_cent_packages {

    echo "-- adding config to allow unverified ssl in yum "
    echo "--     you can remove this from /etc/yum.conf after install"
    echo "sslverify=false" >> /etc/yum.conf

    yum --enablerepo=extras install epel-release -y
    if [[ "$REFRESHREPOS" == "yes" ]];then
        yum update -y
    fi

    YUMPACKAGES='
        redhat-lsb
        openssl-devel
        openssl
        wget
        git
        file-devel
        dialog
        krb5-libs
        krb5-devel
        GeoIP
    '

    for pkg in $YUMPACKAGES; do
        echo ""
        echo "-- Installing $pgk"
        yum install -y $pkg
    done

    # need to install libmaxminddb by hand, because again
    # cent sux
    manually_build_libmaxmind


}

function install_packages {

    echo "---"
    echo "--- Installing System Package Prerequisites for $OS"
    echo "---"

    if [[ $OS == "Ubuntu" ]]; then
        update_apt
        install_ubuntu_packages
    else 
        install_cent_packages
    fi
}
