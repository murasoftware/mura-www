FROM murasoftware/mura:latest
MAINTAINER Matt Levine, matt.levine@getmura.com

ARG admin_hspw=
ARG web_hspw=

RUN sed -i "s/hspw=\"\"/hspw=\"$admin_hspw\"/" /opt/lucee/server/lucee-server/context/lucee-server.xml \
	&& sed -i "s/hspw=\"\"/hspw=\"$web_hspw\"/" /opt/lucee/web/lucee-web.xml.cfm

# Logs
RUN ln -sf /dev/stdout /opt/lucee/web/logs/application.log \
	&& ln -sf /dev/stdout /opt/lucee/web/logs/exception.log

COPY web.xml /usr/local/tomcat/conf/
COPY mura.config.json /var/www/config/

# Copy Mura files
# COPY . /var/www

# Add healthcheck
HEALTHCHECK --start-period=3m CMD curl --fail http://localhost:8888/?healthcheck || exit 1
