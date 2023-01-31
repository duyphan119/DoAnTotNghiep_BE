const str = `
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
DROP DATABASE "DoAnTotNghiep";
CREATE DATABASE "DoAnTotNghiep" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Vietnamese_Vietnam.1258';
ALTER DATABASE "DoAnTotNghiep" OWNER TO postgres;
\connect "DoAnTotNghiep"
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
CREATE TYPE public.donhang_trangthaidonhang_enum AS ENUM (

    'Đang xử lý',
        'Đang giao hàng',
        'Đã hủy',
        'Đã giao',
        'Giỏ hàng'
        );
    ALTER TYPE public.donhang_trangthaidonhang_enum OWNER TO postgres;
    CREATE TYPE public.nhomsanpham_gioitinh_enum AS ENUM (

        'Nam',
        'Nữ',
        'Unisex'
        );
    ALTER TYPE public.nhomsanpham_gioitinh_enum OWNER TO postgres;
    CREATE TYPE public.thongbao_loaithongbao_enum AS ENUM (

        'Đơn hàng',
        'Đánh giá sản phẩm',
        'Trả lời đánh giá sản phẩm'
        );
    ALTER TYPE public.thongbao_loaithongbao_enum OWNER TO postgres;
    SET default_tablespace = '';
    SET default_table_access_method = heap;
    CREATE TABLE public.baiviet (

        mabaiviet integer NOT NULL,
        tieude character varying NOT NULL,
        bidanh character varying NOT NULL,
        noidung text NOT NULL,
        matk integer NOT NULL,
        anhdaidien character varying,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL,
        ngayxoa timestamp without time zone
        );
    ALTER TABLE public.baiviet OWNER TO postgres;
    CREATE SEQUENCE public.baiviet_mabaiviet_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.baiviet_mabaiviet_seq OWNER TO postgres;
    ALTER SEQUENCE public.baiviet_mabaiviet_seq OWNED BY public.baiviet.mabaiviet;
    CREATE TABLE public.bienthe (

        mabt integer NOT NULL,
        tenbt character varying NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.bienthe OWNER TO postgres;
    CREATE SEQUENCE public.bienthe_mabt_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.bienthe_mabt_seq OWNER TO postgres;
    ALTER SEQUENCE public.bienthe_mabt_seq OWNED BY public.bienthe.mabt;
    CREATE TABLE public.binhluanmathang (

        mabinhluan integer NOT NULL,
        matk integer NOT NULL,
        sao integer DEFAULT 5,
        noidung character varying NOT NULL,
        mahang integer NOT NULL,
        mabinhluan_traloi integer,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL,
        mpath character varying DEFAULT ''::character varying,
        "parentId" integer
        );
    ALTER TABLE public.binhluanmathang OWNER TO postgres;
    CREATE SEQUENCE public.binhluanmathang_mabinhluan_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.binhluanmathang_mabinhluan_seq OWNER TO postgres;
    ALTER SEQUENCE public.binhluanmathang_mabinhluan_seq OWNED BY public.binhluanmathang.mabinhluan;
    CREATE TABLE public.caidattrangweb (

        madinhdanh integer NOT NULL,
        tenthuoctinh character varying NOT NULL,
        giatri character varying NOT NULL,
        "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
        "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.caidattrangweb OWNER TO postgres;
    CREATE SEQUENCE public.caidattrangweb_madinhdanh_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.caidattrangweb_madinhdanh_seq OWNER TO postgres;
    ALTER SEQUENCE public.caidattrangweb_madinhdanh_seq OWNED BY public.caidattrangweb.madinhdanh;
    CREATE TABLE public.chitietdonhang (

        machitietdonhang integer NOT NULL,
        madonhang integer NOT NULL,
        mahangbienthe integer,
        soluong integer NOT NULL,
        giaban integer NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.chitietdonhang OWNER TO postgres;
    CREATE SEQUENCE public.chitietdonhang_machitietdonhang_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.chitietdonhang_machitietdonhang_seq OWNER TO postgres;
    ALTER SEQUENCE public.chitietdonhang_machitietdonhang_seq OWNED BY public.chitietdonhang.machitietdonhang;
    CREATE TABLE public.donhang (

        madonhang integer NOT NULL,
        hoten character varying,
        sodienthoai character varying(10),
        tinh character varying,
        quan character varying,
        phuong character varying,
        diachi character varying,
        trangthaidonhang public.donhang_trangthaidonhang_enum DEFAULT 'Giỏ hàng'::public.donhang_trangthaidonhang_enum,
        tienvanchuyen integer DEFAULT 0 NOT NULL,
        phuongthucthanhtoan character varying DEFAULT 'Thanh toán khi nhận hàng (COD)'::character varying NOT NULL,
        ghichu character varying,
        diem integer DEFAULT 0,
        dadathang boolean DEFAULT false,
        chophephuy boolean DEFAULT true,
        dathanhtoan boolean DEFAULT false,
        ngaydat timestamp without time zone,
        matk integer NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL,
        madinhdanh_giamgia integer
        );
    ALTER TABLE public.donhang OWNER TO postgres;
    CREATE SEQUENCE public.donhang_madonhang_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.donhang_madonhang_seq OWNER TO postgres;
    ALTER SEQUENCE public.donhang_madonhang_seq OWNED BY public.donhang.madonhang;
    CREATE TABLE public.giamgiadonhang (

        madinhdanh integer NOT NULL,
        magiamgia character varying(6) NOT NULL,
        batdau timestamp without time zone DEFAULT '2023-01-31 11:06:59.644'::timestamp without time zone NOT NULL,
        ketthuc timestamp without time zone NOT NULL,
        giatoithieu integer DEFAULT 0 NOT NULL,
        giatri integer NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL,
        ngayxoa timestamp without time zone
        );
    ALTER TABLE public.giamgiadonhang OWNER TO postgres;
    CREATE SEQUENCE public.giamgiadonhang_madinhdanh_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.giamgiadonhang_madinhdanh_seq OWNER TO postgres;
    ALTER SEQUENCE public.giamgiadonhang_madinhdanh_seq OWNED BY public.giamgiadonhang.madinhdanh;
    CREATE TABLE public.giatribienthe (

        magiatribienthe integer NOT NULL,
        giatri character varying NOT NULL,
        mabt integer DEFAULT 1 NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.giatribienthe OWNER TO postgres;
    CREATE SEQUENCE public.giatribienthe_magiatribienthe_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.giatribienthe_magiatribienthe_seq OWNER TO postgres;
    ALTER SEQUENCE public.giatribienthe_magiatribienthe_seq OWNED BY public.giatribienthe.magiatribienthe;
    CREATE TABLE public.hinhanhmathangbienthe (

        mahinhanhmathangbienthe integer NOT NULL,
        duongdan character varying,
        mahang integer NOT NULL,
        magiatribienthe integer,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.hinhanhmathangbienthe OWNER TO postgres;
    CREATE SEQUENCE public.hinhanhmathangbienthe_mahinhanhmathangbienthe_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.hinhanhmathangbienthe_mahinhanhmathangbienthe_seq OWNER TO postgres;
    ALTER SEQUENCE public.hinhanhmathangbienthe_mahinhanhmathangbienthe_seq OWNED BY public.hinhanhmathangbienthe.mahinhanhmathangbienthe;
    CREATE TABLE public.mathang (

        mahang integer NOT NULL,
        tenhang character varying NOT NULL,
        duongdan character varying NOT NULL,
        hinhanh character varying,
        mota character varying,
        sao real DEFAULT '0'::real,
        chitiet text,
        manhomsanpham integer DEFAULT 1 NOT NULL,
        solongton integer DEFAULT 0,
        giaban integer NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL,
        ngayxoa timestamp without time zone
        );
    ALTER TABLE public.mathang OWNER TO postgres;
    CREATE SEQUENCE public.mathang_mahang_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.mathang_mahang_seq OWNER TO postgres;
    ALTER SEQUENCE public.mathang_mahang_seq OWNED BY public.mathang.mahang;
    CREATE TABLE public.mathangbienthe (

        mahangbienthe integer NOT NULL,
        tenhangbienthe character varying,
        soluongton integer DEFAULT 0 NOT NULL,
        giaban integer NOT NULL,
        mahang integer NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.mathangbienthe OWNER TO postgres;
    CREATE TABLE public.mathangbienthe_giatribienthe (

        "giatribientheMagiatribienthe" integer NOT NULL,
        "mathangbientheMahangbienthe" integer NOT NULL
        );
    ALTER TABLE public.mathangbienthe_giatribienthe OWNER TO postgres;
    CREATE SEQUENCE public.mathangbienthe_mahangbienthe_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.mathangbienthe_mahangbienthe_seq OWNER TO postgres;
    ALTER SEQUENCE public.mathangbienthe_mahangbienthe_seq OWNED BY public.mathangbienthe.mahangbienthe;
    CREATE TABLE public.migrations (

        id integer NOT NULL,
        "timestamp" bigint NOT NULL,
        name character varying NOT NULL
        );
    ALTER TABLE public.migrations OWNER TO postgres;
    CREATE SEQUENCE public.migrations_id_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.migrations_id_seq OWNER TO postgres;
    ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
    CREATE TABLE public.nhomsanpham (

        manhomsanpham integer NOT NULL,
        tennhomsanpham character varying NOT NULL,
        duongdan character varying NOT NULL,
        hinhanh character varying,
        gioitinh public.nhomsanpham_gioitinh_enum DEFAULT 'Nam'::public.nhomsanpham_gioitinh_enum,
        nguoilon boolean DEFAULT true NOT NULL,
        mota character varying,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL,
        ngayxoa timestamp without time zone
        );
    ALTER TABLE public.nhomsanpham OWNER TO postgres;
    CREATE SEQUENCE public.nhomsanpham_manhomsanpham_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.nhomsanpham_manhomsanpham_seq OWNER TO postgres;
    ALTER SEQUENCE public.nhomsanpham_manhomsanpham_seq OWNED BY public.nhomsanpham.manhomsanpham;
    CREATE TABLE public.quangcao (

        maquangcao integer NOT NULL,
        tieude character varying DEFAULT ''::character varying NOT NULL,
        lienket character varying DEFAULT '/'::character varying NOT NULL,
        duongdan character varying NOT NULL,
        trang character varying DEFAULT 'Trang chủ'::character varying NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.quangcao OWNER TO postgres;
    CREATE SEQUENCE public.quangcao_maquangcao_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.quangcao_maquangcao_seq OWNER TO postgres;
    ALTER SEQUENCE public.quangcao_maquangcao_seq OWNED BY public.quangcao.maquangcao;
    CREATE TABLE public.sodiachi (

        masodiachi integer NOT NULL,
        matk integer NOT NULL,
        tinh character varying,
        quan character varying,
        phuong character varying,
        diachi character varying,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.sodiachi OWNER TO postgres;
    CREATE SEQUENCE public.sodiachi_masodiachi_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.sodiachi_masodiachi_seq OWNER TO postgres;
    ALTER SEQUENCE public.sodiachi_masodiachi_seq OWNED BY public.sodiachi.masodiachi;
    CREATE TABLE public.taikhoan (

        matk integer NOT NULL,
        hoten character varying NOT NULL,
        email character varying NOT NULL,
        matkhau character varying NOT NULL,
        sdt character varying(10),
        diem integer DEFAULT 0 NOT NULL,
        quyen boolean DEFAULT false NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.taikhoan OWNER TO postgres;
    CREATE TABLE public.taikhoan_mathang (

        mataikhoan_mathang integer NOT NULL,
        matk integer NOT NULL,
        mahang integer NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.taikhoan_mathang OWNER TO postgres;
    CREATE SEQUENCE public.taikhoan_mathang_mataikhoan_mathang_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.taikhoan_mathang_mataikhoan_mathang_seq OWNER TO postgres;
    ALTER SEQUENCE public.taikhoan_mathang_mataikhoan_mathang_seq OWNED BY public.taikhoan_mathang.mataikhoan_mathang;
    CREATE SEQUENCE public.taikhoan_matk_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.taikhoan_matk_seq OWNER TO postgres;
    ALTER SEQUENCE public.taikhoan_matk_seq OWNED BY public.taikhoan.matk;
    CREATE TABLE public.thongbao (

        mathongbao integer NOT NULL,
        tinnhan character varying NOT NULL,
        matk integer NOT NULL,
        ngaydoc timestamp without time zone,
        matk_dadoc integer,
        loaithongbao public.thongbao_loaithongbao_enum DEFAULT 'Đơn hàng'::public.thongbao_loaithongbao_enum NOT NULL,
        ngaytao timestamp without time zone DEFAULT now() NOT NULL,
        ngaycapnhat timestamp without time zone DEFAULT now() NOT NULL
        );
    ALTER TABLE public.thongbao OWNER TO postgres;
    CREATE SEQUENCE public.thongbao_mathongbao_seq
    AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

    

    ALTER TABLE public.thongbao_mathongbao_seq OWNER TO postgres;
    ALTER SEQUENCE public.thongbao_mathongbao_seq OWNED BY public.thongbao.mathongbao;
    ALTER TABLE ONLY public.baiviet ALTER COLUMN mabaiviet SET DEFAULT nextval('public.baiviet_mabaiviet_seq'::regclass);
    ALTER TABLE ONLY public.bienthe ALTER COLUMN mabt SET DEFAULT nextval('public.bienthe_mabt_seq'::regclass);
    ALTER TABLE ONLY public.binhluanmathang ALTER COLUMN mabinhluan SET DEFAULT nextval('public.binhluanmathang_mabinhluan_seq'::regclass);
    ALTER TABLE ONLY public.caidattrangweb ALTER COLUMN madinhdanh SET DEFAULT nextval('public.caidattrangweb_madinhdanh_seq'::regclass);
    ALTER TABLE ONLY public.chitietdonhang ALTER COLUMN machitietdonhang SET DEFAULT nextval('public.chitietdonhang_machitietdonhang_seq'::regclass);
    ALTER TABLE ONLY public.donhang ALTER COLUMN madonhang SET DEFAULT nextval('public.donhang_madonhang_seq'::regclass);
    ALTER TABLE ONLY public.giamgiadonhang ALTER COLUMN madinhdanh SET DEFAULT nextval('public.giamgiadonhang_madinhdanh_seq'::regclass);
    ALTER TABLE ONLY public.giatribienthe ALTER COLUMN magiatribienthe SET DEFAULT nextval('public.giatribienthe_magiatribienthe_seq'::regclass);
    ALTER TABLE ONLY public.hinhanhmathangbienthe ALTER COLUMN mahinhanhmathangbienthe SET DEFAULT nextval('public.hinhanhmathangbienthe_mahinhanhmathangbienthe_seq'::regclass);
    ALTER TABLE ONLY public.mathang ALTER COLUMN mahang SET DEFAULT nextval('public.mathang_mahang_seq'::regclass);
    ALTER TABLE ONLY public.mathangbienthe ALTER COLUMN mahangbienthe SET DEFAULT nextval('public.mathangbienthe_mahangbienthe_seq'::regclass);
    ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
    ALTER TABLE ONLY public.nhomsanpham ALTER COLUMN manhomsanpham SET DEFAULT nextval('public.nhomsanpham_manhomsanpham_seq'::regclass);
    ALTER TABLE ONLY public.quangcao ALTER COLUMN maquangcao SET DEFAULT nextval('public.quangcao_maquangcao_seq'::regclass);
    ALTER TABLE ONLY public.sodiachi ALTER COLUMN masodiachi SET DEFAULT nextval('public.sodiachi_masodiachi_seq'::regclass);
    ALTER TABLE ONLY public.taikhoan ALTER COLUMN matk SET DEFAULT nextval('public.taikhoan_matk_seq'::regclass);
    ALTER TABLE ONLY public.taikhoan_mathang ALTER COLUMN mataikhoan_mathang SET DEFAULT nextval('public.taikhoan_mathang_mataikhoan_mathang_seq'::regclass);
    ALTER TABLE ONLY public.thongbao ALTER COLUMN mathongbao SET DEFAULT nextval('public.thongbao_mathongbao_seq'::regclass);
    ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT "PK_0222f21891e8b852676ef8a9b93" PRIMARY KEY (machitietdonhang);

    

    

    ALTER TABLE ONLY public.mathang
    ADD CONSTRAINT "PK_0909d5d44eb84616cb6f8f941bb" PRIMARY KEY (mahang);

    

    

    ALTER TABLE ONLY public.sodiachi
    ADD CONSTRAINT "PK_1ebb1f8624067814a0f1e1815fe" PRIMARY KEY (masodiachi);

    

    

    ALTER TABLE ONLY public.mathangbienthe_giatribienthe
    ADD CONSTRAINT "PK_2c23b65e61d034027eded568f2d" PRIMARY KEY ("giatribientheMagiatribienthe", "mathangbientheMahangbienthe");

    

    

    ALTER TABLE ONLY public.giatribienthe
    ADD CONSTRAINT "PK_3a443ad9f61de748f2e8cedfc46" PRIMARY KEY (magiatribienthe);

    

    

    ALTER TABLE ONLY public.mathangbienthe
    ADD CONSTRAINT "PK_3d44010cc1de88098485ced1b29" PRIMARY KEY (mahangbienthe);

    

    

    ALTER TABLE ONLY public.taikhoan_mathang
    ADD CONSTRAINT "PK_5d84c251b24919c36184395f13d" PRIMARY KEY (mataikhoan_mathang);

    

    

    ALTER TABLE ONLY public.nhomsanpham
    ADD CONSTRAINT "PK_5e15c2f108db8209960a8fc886d" PRIMARY KEY (manhomsanpham);

    

    

    ALTER TABLE ONLY public.baiviet
    ADD CONSTRAINT "PK_7815de61b2e1e26944db7028ffb" PRIMARY KEY (mabaiviet);

    

    

    ALTER TABLE ONLY public.quangcao
    ADD CONSTRAINT "PK_82b8d5b1a87a2b5ffe783516fd2" PRIMARY KEY (maquangcao);

    

    

    ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);

    

    

    ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT "PK_95074908e8fdfa3a78b2479006b" PRIMARY KEY (madonhang);

    

    

    ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT "PK_97de3dbe9aab269171d3db5b47f" PRIMARY KEY (matk);

    

    

    ALTER TABLE ONLY public.thongbao
    ADD CONSTRAINT "PK_a62912796ca7b0f6bc55697690f" PRIMARY KEY (mathongbao);

    

    

    ALTER TABLE ONLY public.binhluanmathang
    ADD CONSTRAINT "PK_a90d41668acefd1eaf81c4378ea" PRIMARY KEY (mabinhluan);

    

    

    ALTER TABLE ONLY public.bienthe
    ADD CONSTRAINT "PK_c74a498cf1b8c942279586c545e" PRIMARY KEY (mabt);

    

    

    ALTER TABLE ONLY public.caidattrangweb
    ADD CONSTRAINT "PK_d380fc57f77bc1d69b6434017f0" PRIMARY KEY (madinhdanh);

    

    

    ALTER TABLE ONLY public.hinhanhmathangbienthe
    ADD CONSTRAINT "PK_e2cd4914e86d59855563e80dcc1" PRIMARY KEY (mahinhanhmathangbienthe);

    

    

    ALTER TABLE ONLY public.giamgiadonhang
    ADD CONSTRAINT "PK_f4ae90e9d1bae0a0b5bdb07b526" PRIMARY KEY (madinhdanh);

    

    

    ALTER TABLE ONLY public.giatribienthe
    ADD CONSTRAINT "UQ_253e095ecdd95b423a67ea6f30f" UNIQUE (giatri);

    

    

    ALTER TABLE ONLY public.mathang
    ADD CONSTRAINT "UQ_3936f428ed4cf07a1ab2480162c" UNIQUE (duongdan);

    

    

    ALTER TABLE ONLY public.bienthe
    ADD CONSTRAINT "UQ_3d972fbc3ac40d70d6861cbfe0a" UNIQUE (tenbt);

    

    

    ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT "UQ_583be8763ca469afd5f544e55bf" UNIQUE (email);

    

    

    CREATE INDEX "IDX_251aece278837ef0cf2600a1d7" ON public.mathangbienthe_giatribienthe USING btree ("giatribientheMagiatribienthe");
    CREATE INDEX "IDX_295a609d0bf6196f1ad2e9a1f3" ON public.mathangbienthe_giatribienthe USING btree ("mathangbientheMahangbienthe");
    ALTER TABLE ONLY public.binhluanmathang
    ADD CONSTRAINT "FK_1abc956a95512aeb00dd6d76011" FOREIGN KEY (matk) REFERENCES public.taikhoan(matk);

    

    

    ALTER TABLE ONLY public.mathangbienthe_giatribienthe
    ADD CONSTRAINT "FK_251aece278837ef0cf2600a1d77" FOREIGN KEY ("giatribientheMagiatribienthe") REFERENCES public.giatribienthe(magiatribienthe) ON UPDATE CASCADE ON DELETE CASCADE;

    

    

    ALTER TABLE ONLY public.mathangbienthe_giatribienthe
    ADD CONSTRAINT "FK_295a609d0bf6196f1ad2e9a1f35" FOREIGN KEY ("mathangbientheMahangbienthe") REFERENCES public.mathangbienthe(mahangbienthe);

    

    

    ALTER TABLE ONLY public.mathang
    ADD CONSTRAINT "FK_35084eb851de910adc159fa2a6d" FOREIGN KEY (manhomsanpham) REFERENCES public.nhomsanpham(manhomsanpham);

    

    

    ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT "FK_3e8082f0e0b049c3c704f44c9cd" FOREIGN KEY (madinhdanh_giamgia) REFERENCES public.giamgiadonhang(madinhdanh);

    

    

    ALTER TABLE ONLY public.binhluanmathang
    ADD CONSTRAINT "FK_45aa346eb1f5fad7c10ccaf7e57" FOREIGN KEY (mahang) REFERENCES public.mathang(mahang);

    

    

    ALTER TABLE ONLY public.giatribienthe
    ADD CONSTRAINT "FK_49f594ade4d5911a742b5dfc1ed" FOREIGN KEY (mabt) REFERENCES public.bienthe(mabt);

    

    

    ALTER TABLE ONLY public.binhluanmathang
    ADD CONSTRAINT "FK_52462308d914255e1cec8773a38" FOREIGN KEY ("parentId") REFERENCES public.binhluanmathang(mabinhluan);

    

    

    ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT "FK_7c33a7cb19ff9c1b1faf08bd8db" FOREIGN KEY (madonhang) REFERENCES public.donhang(madonhang);

    

    

    ALTER TABLE ONLY public.mathangbienthe
    ADD CONSTRAINT "FK_7eeeed853da164fe39f92e2406f" FOREIGN KEY (mahang) REFERENCES public.mathang(mahang);

    

    

    ALTER TABLE ONLY public.donhang
    ADD CONSTRAINT "FK_83f60e8010436c83c1cb9234489" FOREIGN KEY (matk) REFERENCES public.taikhoan(matk);

    

    

    ALTER TABLE ONLY public.hinhanhmathangbienthe
    ADD CONSTRAINT "FK_8c266b157c2a1af8e73bbd4e7dd" FOREIGN KEY (mahang) REFERENCES public.mathang(mahang);

    

    

    ALTER TABLE ONLY public.chitietdonhang
    ADD CONSTRAINT "FK_8e37a71e85dce22f13290f980a6" FOREIGN KEY (mahangbienthe) REFERENCES public.mathangbienthe(mahangbienthe);

    

    

    ALTER TABLE ONLY public.taikhoan_mathang
    ADD CONSTRAINT "FK_8ee6e884de6862a8148fa642b32" FOREIGN KEY (mahang) REFERENCES public.mathang(mahang);

    

    

    

    `;
