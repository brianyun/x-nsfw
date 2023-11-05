import React from 'react';
import Head from 'next/head';

export const NextHead = () => {
	return (
		<Head>
			<meta charSet="utf-8" />
			<title>이장우 교수님 챗봇</title>
			<link rel="canonical" href="https://thingsflow-ir.vercel.app" />
			<link rel="shortcut icon" href="/favicon.ico" />
			<meta property="og:title" content="이장우 교수님 챗봇" />
			<meta
				property="og:description"
				content="안녕하세요! 저는 이장우 교수님 챗봇입니다."
			/>
			<meta property="og:url" content="https://thingsflow-ir.vercel.app" />
			<meta property="og:type" content="website" />
			<meta property="og:locale" content="ko_KR" />
			<meta property="og:image" content={'/logo.jpg'} />
			<meta property="twitter:cardType" content="summary_large_image" />
			<meta property="twitter:handle" content="@handle" />
			<meta property="twitter:site" content="@site" />
		</Head>
	);
};
