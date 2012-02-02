---
layout: post
title: Sample Post
category: blog
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et est porta erat sodales suscipit. Vestibulum a est enim, in volutpat diam. Ut sollicitudin egestas dui, sit amet consectetur magna sodales ac. Nam vitae enim non justo eleifend dapibus. Ut in mi eu nunc placerat dictum eget at felis. Aenean augue tellus, vulputate quis condimentum non, congue eget diam. Nunc accumsan consequat risus ac aliquet. Morbi risus nisl, posuere non rhoncus eu, fringilla sed orci.

Integer tristique aliquet dignissim. Duis euismod fringilla fringilla. Phasellus a vulputate elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse vitae erat tortor, quis bibendum est. Aenean nec neque nec est vehicula pharetra. Nulla et tellus mi, nec facilisis quam. Fusce imperdiet elit eu enim porttitor non tincidunt mi tempus. Donec at accumsan justo. Etiam sed purus elit, a feugiat nulla.

{% highlight c %}
#include <stdio.h>
#include <string.h>
#include <winsock.h>

char *resp = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n";
char *icon = "HTTP/1.1 200 OK\r\nContent-Type: image/icon\r\nConnection: close\r\n\r\n";
char *jpeg = "HTTP/1.1 200 OK\r\nContent-Type: image/jpeg\r\nConnection: close\r\n\r\n";

void exitn(char *m) {
	fprintf(stderr, "%s: %d\n", m, WSAGetLastError());
	exit(1);
}

void rswrite(int cs, char *s) {
	if (send(cs, resp, strlen(resp), 0) != (int)strlen(resp))
		exitn("send failed");
	if (send(cs, s, strlen(s), 0) != (int)strlen(s))
		exitn("send failed");
}

int loadf(const char *file, char **mem) {
	int size = 0;
	FILE *f = fopen(file, "rb");
	if (f == NULL) {
		*mem = NULL;
		return -1;
	}
	fseek(f, 0, SEEK_END);
	size = ftell(f);
	fseek(f, 0, SEEK_SET);
	*mem = (char *)malloc(size+1);
	if (size != fread(*mem, sizeof(char), size, f)) {
		free(*mem);
		return -2;
	}
	fclose(f);
	(*mem)[size] = 0;
	return size;
}

void rsicon(int cs, char *f) {
	char *fc;
	int fs;
	fs = loadf(f, &fc);
	if (fs >= 0) {
		if (send(cs, icon, strlen(icon), 0) != (int)strlen(icon))
			exitn("send failed");
		if (send(cs, fc, fs, 0) != fs)
			exitn("send failed");
		free(fc);
	}
}

void rsjpeg(int cs, char *f) {
	char *fc;
	int fs;
	fs = loadf(f, &fc);
	if (fs >= 0) {
		if (send(cs, jpeg, strlen(jpeg), 0) != (int)strlen(jpeg))
			exitn("send failed");
		if (send(cs, fc, fs, 0) != fs)
			exitn("send failed");
		free(fc);
	}
}

int main(int argc, char *argv[]) {
	WSADATA wsd;
	unsigned short port;
	int ssck, csck;
	struct sockaddr_in sadr, cadr;
	int clen;
	int rcvd;
	char buff[1024];
	char path[100];
	char *pos;
	char *s;
	int len;

	if (argc != 2) {
		fprintf(stderr, "usage: %s <server port>\n", argv[0]);
		exit(1);
	}

	if (WSAStartup(MAKEWORD(1, 0), &wsd) != 0) {
		fprintf(stderr, "WSAStartup failed");
		exit(1);
	}

	port = atoi(argv[1]);
	if ((ssck = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0)
		exitn("socket failed");

	sadr.sin_family = AF_INET;
	sadr.sin_addr.s_addr = htonl(INADDR_ANY);
	sadr.sin_port = htons(port);
	if (bind(ssck, (struct sockaddr *)&sadr, sizeof(sadr)) < 0)
		exitn("bind failed");

	if (listen(ssck, 5) < 0)
		exitn("listen failed");

	for (;;) {
		clen = sizeof(cadr);
		if ((csck = accept(ssck, (struct sockaddr *)&cadr, &clen)) < 0)
			exitn("accept failed");

		printf("handling client %s ", inet_ntoa(cadr.sin_addr));

		if ((rcvd = recv(csck, buff, 1024, 0)) < 0)
			exitn("recv failed");
		buff[rcvd] = 0;

		s = (char *)&buff;
		pos = strstr(s, "GET /");
		if (pos != 0)
			s += (int)(pos-s)+5;
		pos = strchr(s, ' ');
		if (pos != 0) {
			len = (int)(pos-s);
			memcpy(path, s, len);
			path[len] = 0;
		}

		if (strcmp(path, "test/") == 0) {
			rswrite(csck, path);
		} else if (strcmp(path, "favicon.ico") == 0) {
			rsicon(csck, path);
		} else if (strcmp(path, "nigel.jpg") == 0) {
			rsjpeg(csck, path);
		} else {
			rswrite(csck, "not found");
		}

		printf("%s\n", path);
		closesocket(csck);
	}
	return 0;
}
{% endhighlight %}
