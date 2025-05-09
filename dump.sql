--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Messages" (
    id uuid NOT NULL,
    subject character varying(255),
    text text NOT NULL,
    "sendAt" date NOT NULL,
    receiver uuid,
    sender uuid
);


ALTER TABLE public."Messages" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id uuid NOT NULL,
    title character varying(255) DEFAULT NULL::character varying NOT NULL,
    description text,
    start_date date,
    deadline date,
    last_update date,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    document_url character varying(255),
    "clockifyProjectId" character varying(255)
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id uuid NOT NULL,
    title character varying(255) DEFAULT NULL::character varying NOT NULL,
    description text,
    start_date date NOT NULL,
    end_date date,
    completed boolean DEFAULT false,
    priority character varying(255) DEFAULT NULL::character varying NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    "clockifyTaskId" character varying(255),
    associated_project uuid
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: Task_staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task_staff" (
    id uuid NOT NULL,
    task uuid,
    staff uuid
);


ALTER TABLE public."Task_staff" OWNER TO postgres;

--
-- Name: directus_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_access (
    id uuid NOT NULL,
    role uuid,
    "user" uuid,
    policy uuid NOT NULL,
    sort integer
);


ALTER TABLE public.directus_access OWNER TO postgres;

--
-- Name: directus_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_activity (
    id integer NOT NULL,
    action character varying(45) NOT NULL,
    "user" uuid,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip character varying(50),
    user_agent text,
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    origin character varying(255)
);


ALTER TABLE public.directus_activity OWNER TO postgres;

--
-- Name: directus_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_activity_id_seq OWNER TO postgres;

--
-- Name: directus_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_activity_id_seq OWNED BY public.directus_activity.id;


--
-- Name: directus_collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_collections (
    collection character varying(64) NOT NULL,
    icon character varying(64),
    note text,
    display_template character varying(255),
    hidden boolean DEFAULT false NOT NULL,
    singleton boolean DEFAULT false NOT NULL,
    translations json,
    archive_field character varying(64),
    archive_app_filter boolean DEFAULT true NOT NULL,
    archive_value character varying(255),
    unarchive_value character varying(255),
    sort_field character varying(64),
    accountability character varying(255) DEFAULT 'all'::character varying,
    color character varying(255),
    item_duplication_fields json,
    sort integer,
    "group" character varying(64),
    collapse character varying(255) DEFAULT 'open'::character varying NOT NULL,
    preview_url character varying(255),
    versioning boolean DEFAULT false NOT NULL
);


ALTER TABLE public.directus_collections OWNER TO postgres;

--
-- Name: directus_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_comments (
    id uuid NOT NULL,
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    comment text NOT NULL,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid,
    user_updated uuid
);


ALTER TABLE public.directus_comments OWNER TO postgres;

--
-- Name: directus_dashboards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_dashboards (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(64) DEFAULT 'dashboard'::character varying NOT NULL,
    note text,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid,
    color character varying(255)
);


ALTER TABLE public.directus_dashboards OWNER TO postgres;

--
-- Name: directus_extensions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_extensions (
    enabled boolean DEFAULT true NOT NULL,
    id uuid NOT NULL,
    folder character varying(255) NOT NULL,
    source character varying(255) NOT NULL,
    bundle uuid
);


ALTER TABLE public.directus_extensions OWNER TO postgres;

--
-- Name: directus_fields; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_fields (
    id integer NOT NULL,
    collection character varying(64) NOT NULL,
    field character varying(64) NOT NULL,
    special character varying(64),
    interface character varying(64),
    options json,
    display character varying(64),
    display_options json,
    readonly boolean DEFAULT false NOT NULL,
    hidden boolean DEFAULT false NOT NULL,
    sort integer,
    width character varying(30) DEFAULT 'full'::character varying,
    translations json,
    note text,
    conditions json,
    required boolean DEFAULT false,
    "group" character varying(64),
    validation json,
    validation_message text
);


ALTER TABLE public.directus_fields OWNER TO postgres;

--
-- Name: directus_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_fields_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_fields_id_seq OWNER TO postgres;

--
-- Name: directus_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_fields_id_seq OWNED BY public.directus_fields.id;


--
-- Name: directus_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_files (
    id uuid NOT NULL,
    storage character varying(255) NOT NULL,
    filename_disk character varying(255),
    filename_download character varying(255) NOT NULL,
    title character varying(255),
    type character varying(255),
    folder uuid,
    uploaded_by uuid,
    created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified_by uuid,
    modified_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    charset character varying(50),
    filesize bigint,
    width integer,
    height integer,
    duration integer,
    embed character varying(200),
    description text,
    location text,
    tags text,
    metadata json,
    focal_point_x integer,
    focal_point_y integer,
    tus_id character varying(64),
    tus_data json,
    uploaded_on timestamp with time zone
);


ALTER TABLE public.directus_files OWNER TO postgres;

--
-- Name: directus_flows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_flows (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(64),
    color character varying(255),
    description text,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    trigger character varying(255),
    accountability character varying(255) DEFAULT 'all'::character varying,
    options json,
    operation uuid,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid
);


ALTER TABLE public.directus_flows OWNER TO postgres;

--
-- Name: directus_folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_folders (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    parent uuid
);


ALTER TABLE public.directus_folders OWNER TO postgres;

--
-- Name: directus_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_migrations (
    version character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.directus_migrations OWNER TO postgres;

--
-- Name: directus_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_notifications (
    id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255) DEFAULT 'inbox'::character varying,
    recipient uuid NOT NULL,
    sender uuid,
    subject character varying(255) NOT NULL,
    message text,
    collection character varying(64),
    item character varying(255)
);


ALTER TABLE public.directus_notifications OWNER TO postgres;

--
-- Name: directus_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_notifications_id_seq OWNER TO postgres;

--
-- Name: directus_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_notifications_id_seq OWNED BY public.directus_notifications.id;


--
-- Name: directus_operations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_operations (
    id uuid NOT NULL,
    name character varying(255),
    key character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    position_x integer NOT NULL,
    position_y integer NOT NULL,
    options json,
    resolve uuid,
    reject uuid,
    flow uuid NOT NULL,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid
);


ALTER TABLE public.directus_operations OWNER TO postgres;

--
-- Name: directus_panels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_panels (
    id uuid NOT NULL,
    dashboard uuid NOT NULL,
    name character varying(255),
    icon character varying(64) DEFAULT NULL::character varying,
    color character varying(10),
    show_header boolean DEFAULT false NOT NULL,
    note text,
    type character varying(255) NOT NULL,
    position_x integer NOT NULL,
    position_y integer NOT NULL,
    width integer NOT NULL,
    height integer NOT NULL,
    options json,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid
);


ALTER TABLE public.directus_panels OWNER TO postgres;

--
-- Name: directus_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_permissions (
    id integer NOT NULL,
    collection character varying(64) NOT NULL,
    action character varying(10) NOT NULL,
    permissions json,
    validation json,
    presets json,
    fields text,
    policy uuid NOT NULL
);


ALTER TABLE public.directus_permissions OWNER TO postgres;

--
-- Name: directus_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_permissions_id_seq OWNER TO postgres;

--
-- Name: directus_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_permissions_id_seq OWNED BY public.directus_permissions.id;


--
-- Name: directus_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_policies (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    icon character varying(64) DEFAULT 'badge'::character varying NOT NULL,
    description text,
    ip_access text,
    enforce_tfa boolean DEFAULT false NOT NULL,
    admin_access boolean DEFAULT false NOT NULL,
    app_access boolean DEFAULT false NOT NULL
);


ALTER TABLE public.directus_policies OWNER TO postgres;

--
-- Name: directus_presets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_presets (
    id integer NOT NULL,
    bookmark character varying(255),
    "user" uuid,
    role uuid,
    collection character varying(64),
    search character varying(100),
    layout character varying(100) DEFAULT 'tabular'::character varying,
    layout_query json,
    layout_options json,
    refresh_interval integer,
    filter json,
    icon character varying(64) DEFAULT 'bookmark'::character varying,
    color character varying(255)
);


ALTER TABLE public.directus_presets OWNER TO postgres;

--
-- Name: directus_presets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_presets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_presets_id_seq OWNER TO postgres;

--
-- Name: directus_presets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_presets_id_seq OWNED BY public.directus_presets.id;


--
-- Name: directus_relations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_relations (
    id integer NOT NULL,
    many_collection character varying(64) NOT NULL,
    many_field character varying(64) NOT NULL,
    one_collection character varying(64),
    one_field character varying(64),
    one_collection_field character varying(64),
    one_allowed_collections text,
    junction_field character varying(64),
    sort_field character varying(64),
    one_deselect_action character varying(255) DEFAULT 'nullify'::character varying NOT NULL
);


ALTER TABLE public.directus_relations OWNER TO postgres;

--
-- Name: directus_relations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_relations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_relations_id_seq OWNER TO postgres;

--
-- Name: directus_relations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_relations_id_seq OWNED BY public.directus_relations.id;


--
-- Name: directus_revisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_revisions (
    id integer NOT NULL,
    activity integer NOT NULL,
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    data json,
    delta json,
    parent integer,
    version uuid
);


ALTER TABLE public.directus_revisions OWNER TO postgres;

--
-- Name: directus_revisions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_revisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_revisions_id_seq OWNER TO postgres;

--
-- Name: directus_revisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_revisions_id_seq OWNED BY public.directus_revisions.id;


--
-- Name: directus_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_roles (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    icon character varying(64) DEFAULT 'supervised_user_circle'::character varying NOT NULL,
    description text,
    parent uuid
);


ALTER TABLE public.directus_roles OWNER TO postgres;

--
-- Name: directus_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_sessions (
    token character varying(64) NOT NULL,
    "user" uuid,
    expires timestamp with time zone NOT NULL,
    ip character varying(255),
    user_agent text,
    share uuid,
    origin character varying(255),
    next_token character varying(64)
);


ALTER TABLE public.directus_sessions OWNER TO postgres;

--
-- Name: directus_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_settings (
    id integer NOT NULL,
    project_name character varying(100) DEFAULT 'Directus'::character varying NOT NULL,
    project_url character varying(255),
    project_color character varying(255) DEFAULT '#6644FF'::character varying NOT NULL,
    project_logo uuid,
    public_foreground uuid,
    public_background uuid,
    public_note text,
    auth_login_attempts integer DEFAULT 25,
    auth_password_policy character varying(100),
    storage_asset_transform character varying(7) DEFAULT 'all'::character varying,
    storage_asset_presets json,
    custom_css text,
    storage_default_folder uuid,
    basemaps json,
    mapbox_key character varying(255),
    module_bar json,
    project_descriptor character varying(100),
    default_language character varying(255) DEFAULT 'en-US'::character varying NOT NULL,
    custom_aspect_ratios json,
    public_favicon uuid,
    default_appearance character varying(255) DEFAULT 'auto'::character varying NOT NULL,
    default_theme_light character varying(255),
    theme_light_overrides json,
    default_theme_dark character varying(255),
    theme_dark_overrides json,
    report_error_url character varying(255),
    report_bug_url character varying(255),
    report_feature_url character varying(255),
    public_registration boolean DEFAULT false NOT NULL,
    public_registration_verify_email boolean DEFAULT true NOT NULL,
    public_registration_role uuid,
    public_registration_email_filter json,
    visual_editor_urls json
);


ALTER TABLE public.directus_settings OWNER TO postgres;

--
-- Name: directus_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_settings_id_seq OWNER TO postgres;

--
-- Name: directus_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_settings_id_seq OWNED BY public.directus_settings.id;


--
-- Name: directus_shares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_shares (
    id uuid NOT NULL,
    name character varying(255),
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    role uuid,
    password character varying(255),
    user_created uuid,
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_start timestamp with time zone,
    date_end timestamp with time zone,
    times_used integer DEFAULT 0,
    max_uses integer
);


ALTER TABLE public.directus_shares OWNER TO postgres;

--
-- Name: directus_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_translations (
    id uuid NOT NULL,
    language character varying(255) NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.directus_translations OWNER TO postgres;

--
-- Name: directus_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_users (
    id uuid NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(128),
    password character varying(255),
    location character varying(255),
    title character varying(50),
    description text,
    tags json,
    avatar uuid,
    language character varying(255) DEFAULT NULL::character varying,
    tfa_secret character varying(255),
    status character varying(16) DEFAULT 'active'::character varying NOT NULL,
    role uuid,
    token character varying(255),
    last_access timestamp with time zone,
    last_page character varying(255),
    provider character varying(128) DEFAULT 'default'::character varying NOT NULL,
    external_identifier character varying(255),
    auth_data json,
    email_notifications boolean DEFAULT true,
    appearance character varying(255),
    theme_dark character varying(255),
    theme_light character varying(255),
    theme_light_overrides json,
    theme_dark_overrides json,
    phone character varying(255) DEFAULT NULL::character varying NOT NULL,
    register_date date,
    type character varying(255) DEFAULT 'user'::character varying,
    "resetToken" character varying(255),
    "resetTokenExpiry" character varying(255),
    "profileImage" character varying(255),
    "clockifyUserId" character varying(255)
);


ALTER TABLE public.directus_users OWNER TO postgres;

--
-- Name: directus_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_versions (
    id uuid NOT NULL,
    key character varying(64) NOT NULL,
    name character varying(255),
    collection character varying(64) NOT NULL,
    item character varying(255) NOT NULL,
    hash character varying(255),
    date_created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    date_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    user_created uuid,
    user_updated uuid,
    delta json
);


ALTER TABLE public.directus_versions OWNER TO postgres;

--
-- Name: directus_webhooks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directus_webhooks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    method character varying(10) DEFAULT 'POST'::character varying NOT NULL,
    url character varying(255) NOT NULL,
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    data boolean DEFAULT true NOT NULL,
    actions character varying(100) NOT NULL,
    collections character varying(255) NOT NULL,
    headers json,
    was_active_before_deprecation boolean DEFAULT false NOT NULL,
    migrated_flow uuid
);


ALTER TABLE public.directus_webhooks OWNER TO postgres;

--
-- Name: directus_webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directus_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directus_webhooks_id_seq OWNER TO postgres;

--
-- Name: directus_webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directus_webhooks_id_seq OWNED BY public.directus_webhooks.id;


--
-- Name: directus_activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_activity ALTER COLUMN id SET DEFAULT nextval('public.directus_activity_id_seq'::regclass);


--
-- Name: directus_fields id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_fields ALTER COLUMN id SET DEFAULT nextval('public.directus_fields_id_seq'::regclass);


--
-- Name: directus_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_notifications ALTER COLUMN id SET DEFAULT nextval('public.directus_notifications_id_seq'::regclass);


--
-- Name: directus_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_permissions ALTER COLUMN id SET DEFAULT nextval('public.directus_permissions_id_seq'::regclass);


--
-- Name: directus_presets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_presets ALTER COLUMN id SET DEFAULT nextval('public.directus_presets_id_seq'::regclass);


--
-- Name: directus_relations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_relations ALTER COLUMN id SET DEFAULT nextval('public.directus_relations_id_seq'::regclass);


--
-- Name: directus_revisions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_revisions ALTER COLUMN id SET DEFAULT nextval('public.directus_revisions_id_seq'::regclass);


--
-- Name: directus_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings ALTER COLUMN id SET DEFAULT nextval('public.directus_settings_id_seq'::regclass);


--
-- Name: directus_webhooks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_webhooks ALTER COLUMN id SET DEFAULT nextval('public.directus_webhooks_id_seq'::regclass);


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Messages" (id, subject, text, "sendAt", receiver, sender) FROM stdin;
5096b02a-9133-4263-9e98-3465cc81c91c	\N	dewdq3we	2025-05-08	\N	\N
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, title, description, start_date, deadline, last_update, status, document_url, "clockifyProjectId") FROM stdin;
2674e6ed-0779-4afe-b9cd-a74ad55c0605	P1	\N	2025-05-08	\N	\N	active	\N	\N
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, description, start_date, end_date, completed, priority, status, "clockifyTaskId", associated_project) FROM stdin;
b6d9a9c6-ac6c-4533-92b6-248efb111401	t1	\N	2025-05-08	\N	f	medium	active	\N	2674e6ed-0779-4afe-b9cd-a74ad55c0605
\.


--
-- Data for Name: Task_staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task_staff" (id, task, staff) FROM stdin;
ad7aa93e-ea6c-4390-99d3-69944dd48e01	b6d9a9c6-ac6c-4533-92b6-248efb111401	\N
\.


--
-- Data for Name: directus_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_access (id, role, "user", policy, sort) FROM stdin;
c504421c-a3f1-4106-8535-f9b07604141f	\N	3d59b549-1665-4368-8631-586f02ea12e5	839e307f-de45-4dd6-9715-818dbc2103ef	2
16c217b4-040c-46a6-ba90-949fac9618dd	\N	\N	abf8a154-5b1c-4a46-ac9c-7300570f4f17	1
2b313a97-8a94-4133-a3a3-c41d43cefa88	4256f46d-8fe5-4a49-92b8-310645edb13f	\N	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	\N
b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e	\N	ccd2cde6-bda7-46d3-8658-760a82e3f952	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	\N
120f41ed-a4fd-490d-97cf-6227795249d1	\N	aafe6467-b329-42b7-b91e-e7b70c118437	839e307f-de45-4dd6-9715-818dbc2103ef	1
\.


--
-- Data for Name: directus_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_activity (id, action, "user", "timestamp", ip, user_agent, collection, item, origin) FROM stdin;
1	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:42:03.692+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	http://localhost:8055
2	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:43:14.207+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	1	http://localhost:8055
3	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:43:14.211+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	frf	http://localhost:8055
4	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:51:02.124+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	frf	http://localhost:8055
5	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:51:02.126+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	1	http://localhost:8055
6	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:51:26.52+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	2	http://localhost:8055
7	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:51:26.523+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Staff2	http://localhost:8055
8	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:51:41.873+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	3	http://localhost:8055
9	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 10:51:51.019+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	4	http://localhost:8055
10	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:19:16.417+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Staff2	http://localhost:8055
11	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:19:16.419+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	2	http://localhost:8055
12	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:19:16.419+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	3	http://localhost:8055
13	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:19:16.42+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	4	http://localhost:8055
14	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:19:31.811+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	5	http://localhost:8055
15	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:19:31.813+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Staff	http://localhost:8055
16	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:23:33.982+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	6	http://localhost:8055
17	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:23:41.543+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	7	http://localhost:8055
18	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:23:58.437+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	7	http://localhost:8055
19	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:24:08.958+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	8	http://localhost:8055
20	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:24:20.705+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	8	http://localhost:8055
21	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:25:06.53+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	9	http://localhost:8055
22	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:25:40.762+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	10	http://localhost:8055
23	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:25:47.131+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	10	http://localhost:8055
24	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:26:30.565+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	11	http://localhost:8055
25	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:26:43.749+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	11	http://localhost:8055
26	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:27:00.556+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	12	http://localhost:8055
27	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:27:19.62+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	13	http://localhost:8055
28	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:27:44.175+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	14	http://localhost:8055
29	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:27:59.145+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	15	http://localhost:8055
30	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:28:49.349+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	16	http://localhost:8055
31	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:28:49.352+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Project	http://localhost:8055
32	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:29:37.603+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	17	http://localhost:8055
33	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:31:20.974+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	17	http://localhost:8055
34	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:31:45.406+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	18	http://localhost:8055
35	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:32:01.784+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	19	http://localhost:8055
36	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:32:05.524+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	19	http://localhost:8055
37	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:32:18.523+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	20	http://localhost:8055
38	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:32:39.16+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	21	http://localhost:8055
39	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:33:31.634+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	22	http://localhost:8055
40	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:33:50.702+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	22	http://localhost:8055
41	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:34:15.115+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	23	http://localhost:8055
42	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:34:33.636+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	24	http://localhost:8055
43	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:36:07.109+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	25	http://localhost:8055
44	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:36:07.112+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Task	http://localhost:8055
45	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:36:21.974+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	26	http://localhost:8055
47	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:36:56.569+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	27	http://localhost:8055
48	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:37:17.07+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	28	http://localhost:8055
49	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:37:24.631+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	28	http://localhost:8055
50	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:37:37.476+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	28	http://localhost:8055
51	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:37:50.762+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	29	http://localhost:8055
46	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:36:29.708+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	17	http://localhost:8055
52	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:38:00.86+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	29	http://localhost:8055
53	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:38:13.537+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	30	http://localhost:8055
54	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:38:21.236+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	30	http://localhost:8055
55	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:38:30.058+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	30	http://localhost:8055
56	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:39:07.475+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	31	http://localhost:8055
57	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:40:07.516+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	32	http://localhost:8055
58	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:40:23.811+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	32	http://localhost:8055
59	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:41:18.023+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	33	http://localhost:8055
60	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:41:49.727+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	33	http://localhost:8055
61	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:41:56.492+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	32	http://localhost:8055
62	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:42:09.819+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	34	http://localhost:8055
63	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:42:54.422+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	35	http://localhost:8055
64	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:42:54.426+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Messages	http://localhost:8055
65	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:43:24.063+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	36	http://localhost:8055
66	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:43:37.945+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	37	http://localhost:8055
67	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:43:54.531+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	37	http://localhost:8055
68	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:44:11.451+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	38	http://localhost:8055
69	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:44:21.238+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	38	http://localhost:8055
70	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:44:55.057+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	39	http://localhost:8055
71	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:44:55.059+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Task_staff	http://localhost:8055
72	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:50:32.643+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	40	http://localhost:8055
73	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:50:55.199+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	41	http://localhost:8055
74	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:56:12.137+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	42	http://localhost:8055
75	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:59:29.974+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	43	http://localhost:8055
76	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 11:59:54.196+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	44	http://localhost:8055
77	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:52:51.906+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	10	http://localhost:8055
79	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:53:59.031+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	19	http://localhost:8055
80	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:55:24.737+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	38	http://localhost:8055
81	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:55:45.587+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	29	http://localhost:8055
82	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:57:51.063+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	Project	2674e6ed-0779-4afe-b9cd-a74ad55c0605	http://localhost:8055
83	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:58:17.964+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	28	http://localhost:8055
84	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:58:50.068+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	Task	b6d9a9c6-ac6c-4533-92b6-248efb111401	http://localhost:8055
85	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 12:59:12.509+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	Task_staff	ad7aa93e-ea6c-4390-99d3-69944dd48e01	http://localhost:8055
87	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:00:04.96+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	Messages	5096b02a-9133-4263-9e98-3465cc81c91c	http://localhost:8055
88	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:17:10.28+00	172.22.0.8	axios/1.9.0	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
89	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:18:46.302+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
90	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:21:39.323+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
91	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:21:39.874+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
92	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:21:40.061+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
93	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:24:09.882+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
94	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.097+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	1	http://localhost:8055
95	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.1+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	2	http://localhost:8055
96	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.102+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	3	http://localhost:8055
97	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.104+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	4	http://localhost:8055
98	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.106+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	5	http://localhost:8055
99	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.109+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	abf8a154-5b1c-4a46-ac9c-7300570f4f17	http://localhost:8055
100	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:05.112+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	http://localhost:8055
101	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:08.641+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
102	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:59.185+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	fe9a601b-b6bd-4cd7-b4b7-59a2bedf8b5a	http://localhost:8055
103	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:59.188+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	839e307f-de45-4dd6-9715-818dbc2103ef	http://localhost:8055
104	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:59.19+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	27ade98e-29d4-489f-b701-2fc0ebf3418b	http://localhost:8055
105	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:25:59.193+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
106	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:26:07.609+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
107	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:26:08.197+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
108	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:26:58.638+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
109	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:27:13.87+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	96472733-e620-4515-85f5-3e7fc490e08a	http://localhost:8055
110	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:27:13.874+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	5efc55e0-70db-4e72-acc3-1788b70071f9	http://localhost:8055
111	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:27:13.876+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	abf8a154-5b1c-4a46-ac9c-7300570f4f17	http://localhost:8055
112	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:27:13.879+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	http://localhost:8055
113	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:27:21.954+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
114	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:29:54.21+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	96472733-e620-4515-85f5-3e7fc490e08a	http://localhost:8055
115	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:29:54.215+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
116	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:30:58.077+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	5efc55e0-70db-4e72-acc3-1788b70071f9	http://localhost:8055
117	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:30:58.078+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	abf8a154-5b1c-4a46-ac9c-7300570f4f17	http://localhost:8055
118	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:30:58.083+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	http://localhost:8055
119	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:31:21.207+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	27ade98e-29d4-489f-b701-2fc0ebf3418b	http://localhost:8055
120	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:31:21.21+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	96472733-e620-4515-85f5-3e7fc490e08a	http://localhost:8055
121	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:31:21.212+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
122	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:31:24.34+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
123	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:39:39.26+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	http://localhost:8055
124	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:42:32.442+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
125	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:43:03.29+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
126	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:43:14.504+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
127	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.27+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	977b67ea-1c04-4f06-9a6b-e71194cc07a2	http://localhost:8055
128	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.274+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	6	http://localhost:8055
129	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.277+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	7	http://localhost:8055
130	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.279+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	8	http://localhost:8055
131	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.28+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	9	http://localhost:8055
132	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.282+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	10	http://localhost:8055
133	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.286+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	70df60da-c89c-4257-8ee9-7c77cb2a0d53	http://localhost:8055
134	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.288+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	f945e7a0-406e-4bb0-92bd-51c5053d6dc2	http://localhost:8055
135	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.29+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	27cd3188-cfd1-497c-89b8-ac2207d242a6	http://localhost:8055
248	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:33.177+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
136	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:45:14.292+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
137	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:46:26.155+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
138	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:48:57.381+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
139	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:51:02.687+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
140	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 13:52:56.511+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
141	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:05:04.105+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	http://localhost:8055
142	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:05:45.25+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	http://localhost:8055
143	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:05:59.457+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	http://localhost:8055
144	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:06:50.961+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
145	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:07:14.783+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
146	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:07:20.237+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	http://localhost:8055
147	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:08:42.837+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	27cd3188-cfd1-497c-89b8-ac2207d242a6	http://localhost:8055
148	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:08:42.847+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
149	login	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:08:51.901+00	172.22.0.8	node	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	\N
150	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:11:22.437+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
151	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:11:44.452+00	172.22.0.8	curl/8.12.1	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
152	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:13:18.654+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
153	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:16:19.912+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
154	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:19:11.152+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
155	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:19:38.878+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
156	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:19:41.782+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
157	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:21:50.804+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	977b67ea-1c04-4f06-9a6b-e71194cc07a2	http://localhost:8055
158	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:21:50.807+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
159	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:21:57.54+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	27cd3188-cfd1-497c-89b8-ac2207d242a6	http://localhost:8055
160	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:21:57.543+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
161	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:23:17.23+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
162	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:23:23.121+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
163	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.829+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	ac28245e-f495-446e-a4ab-525e77ccec0f	http://localhost:8055
164	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.837+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	11	http://localhost:8055
165	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.839+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	12	http://localhost:8055
166	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.841+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	13	http://localhost:8055
167	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.843+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	14	http://localhost:8055
168	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.845+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	15	http://localhost:8055
169	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.848+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	42862065-3e92-49eb-91b5-23a9f4aab3f9	http://localhost:8055
170	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.85+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	8d684e58-6316-402d-b63f-33af549e64ec	http://localhost:8055
171	create	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.852+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	ffa3c725-d77b-4002-9cfd-d507b9d041fd	http://localhost:8055
249	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:34.026+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
172	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:24:32.855+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
173	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:24:40.814+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
174	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:24:52.456+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
175	delete	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:25:19.605+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	ffa3c725-d77b-4002-9cfd-d507b9d041fd	http://localhost:8055
176	update	a4588c22-c82e-4f17-a623-e2c159646e80	2025-05-08 14:25:19.607+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
177	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:26:05.053+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
178	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:26:19.77+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
179	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:28:11.57+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
180	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:28:53.976+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
181	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:30:09.967+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
182	delete	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:34:05.856+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	a4588c22-c82e-4f17-a623-e2c159646e80	http://localhost:8055
183	create	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:35:34.75+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
184	create	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:36:04.47+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	85fc0bb1-a53d-476e-bf24-e41dd84e039d	http://localhost:8055
185	create	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:36:04.473+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	c504421c-a3f1-4106-8535-f9b07604141f	http://localhost:8055
186	create	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:36:04.476+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	e18a6743-07ba-4315-baec-30f03fb7c469	http://localhost:8055
187	update	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:36:04.478+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
188	update	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:36:13.108+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
189	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:37:08.106+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
190	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:41:43.178+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
191	delete	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:43:01.467+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	27ade98e-29d4-489f-b701-2fc0ebf3418b	http://localhost:8055
192	update	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:43:01.469+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	fd0935c8-df79-4771-84c9-c73875fdd763	http://localhost:8055
193	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:43:26.386+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
194	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:43:55.252+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
195	login	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:46:20.028+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
196	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:47:31.249+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	8d684e58-6316-402d-b63f-33af549e64ec	http://localhost:8055
197	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:47:31.261+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	42862065-3e92-49eb-91b5-23a9f4aab3f9	http://localhost:8055
198	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:47:31.267+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	42862065-3e92-49eb-91b5-23a9f4aab3f9	http://localhost:8055
199	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:47:31.269+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
200	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:47:42.323+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	c1e7917b-f4d5-4ef9-baee-bff3f7c79398	http://localhost:8055
201	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:47:42.327+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
202	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:48:18.011+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
203	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:48:32.979+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
204	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:49:34.318+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
205	login	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:53:26.212+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
250	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:34.265+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
206	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:54:00.246+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	abf8a154-5b1c-4a46-ac9c-7300570f4f17	http://localhost:8055
207	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-08 14:54:00.258+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	http://localhost:8055
208	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:54:54.589+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
209	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-08 14:56:51.788+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
210	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:37:53.987+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
211	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:40:39.781+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
212	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:48:10.788+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
213	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:48:59.719+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
214	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:49:15.664+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
215	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:50:07.586+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
216	login	7136fddd-4146-40f5-b506-25b77ededdf5	2025-05-09 05:51:17.504+00	172.22.0.8	node	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	\N
217	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:06:13.049+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	http://localhost:8055
218	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:06:13.058+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
219	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:07:51.144+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
220	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:10:05.684+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	6398e22d-ba9b-47d3-81eb-407142fcf069	http://localhost:8055
221	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:10:05.688+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	http://localhost:8055
222	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:10:05.692+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
223	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:07.877+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
224	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:09.345+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
225	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:09.78+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
226	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:09.941+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
227	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:10.096+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
228	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:10.418+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
229	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:10.568+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
230	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:10.742+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
231	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:10.902+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
232	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:11.058+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
233	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:11.205+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
234	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:11.35+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
235	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:11.533+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
236	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:11.691+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
237	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:11.85+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
238	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:10:54.865+00	172.22.0.1	PostmanRuntime/7.43.4	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
239	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:12:39.463+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
240	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:13:33.726+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	fc863c4b-1eeb-4d38-8d9c-781cc3a76c45	http://localhost:8055
241	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:13:33.73+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
242	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:13:33.736+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
243	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:13:58.174+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	6398e22d-ba9b-47d3-81eb-407142fcf069	http://localhost:8055
244	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:13:58.176+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
245	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:14:16.04+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	http://localhost:8055
246	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:14:16.044+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
247	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:14:30.648+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
251	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:34.414+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
252	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:34.596+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
253	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:34.752+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
254	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:17:34.915+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
255	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:18.987+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	2b313a97-8a94-4133-a3a3-c41d43cefa88	http://localhost:8055
256	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:18.995+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	16	http://localhost:8055
257	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:18.997+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	17	http://localhost:8055
258	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:18.999+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	18	http://localhost:8055
259	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.001+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	19	http://localhost:8055
260	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.003+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	20	http://localhost:8055
261	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.005+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	21	http://localhost:8055
262	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.006+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	22	http://localhost:8055
263	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.008+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	23	http://localhost:8055
264	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.009+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	24	http://localhost:8055
265	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.011+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	25	http://localhost:8055
266	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.013+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	26	http://localhost:8055
267	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.014+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	27	http://localhost:8055
268	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.016+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	28	http://localhost:8055
269	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.018+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	29	http://localhost:8055
270	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.019+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	30	http://localhost:8055
271	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.021+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	31	http://localhost:8055
272	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.023+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	32	http://localhost:8055
273	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.024+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	33	http://localhost:8055
274	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.026+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	34	http://localhost:8055
275	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.028+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	35	http://localhost:8055
276	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.03+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e	http://localhost:8055
277	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.032+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	http://localhost:8055
278	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.036+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	b4ff35bf-e7ca-4555-9a24-a5f1393d4d12	http://localhost:8055
279	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:19.038+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
280	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:28.962+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	b4ff35bf-e7ca-4555-9a24-a5f1393d4d12	http://localhost:8055
281	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:28.965+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
282	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:36.589+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	fc863c4b-1eeb-4d38-8d9c-781cc3a76c45	http://localhost:8055
283	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:18:36.59+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
284	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.834+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	36	http://localhost:8055
326	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:47:47.761+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
285	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.836+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	37	http://localhost:8055
286	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.838+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	38	http://localhost:8055
287	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.84+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	39	http://localhost:8055
288	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.842+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	40	http://localhost:8055
289	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.844+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	http://localhost:8055
290	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.846+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	2b313a97-8a94-4133-a3a3-c41d43cefa88	http://localhost:8055
291	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:19:27.849+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
292	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:20:09.983+00	172.22.0.1	PostmanRuntime/7.43.4	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
293	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:21:54.546+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
294	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:21:54.733+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
295	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:22:07.946+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
296	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:22:08.118+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
297	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:28.115+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
298	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:44.112+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
299	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:44.931+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
300	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:45.127+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
301	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:45.283+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
302	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:45.445+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
303	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:45.61+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
304	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:45.763+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
305	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:45.94+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
306	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:25:52.102+00	172.22.0.1	PostmanRuntime/7.43.4	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
307	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:27:09.906+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
308	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:28:20.928+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	2b313a97-8a94-4133-a3a3-c41d43cefa88	http://localhost:8055
309	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:28:20.935+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	http://localhost:8055
310	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:28:42.27+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	http://localhost:8055
311	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:28:42.272+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
312	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.537+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	41	http://localhost:8055
313	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.54+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	42	http://localhost:8055
314	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.543+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	43	http://localhost:8055
315	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.545+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	44	http://localhost:8055
316	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.548+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	45	http://localhost:8055
317	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.55+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	http://localhost:8055
318	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.554+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e	http://localhost:8055
319	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 06:29:05.557+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
320	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:29:22.16+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
321	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:32:46.75+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
322	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:38:56.718+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
323	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:38:59.305+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
324	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:42:46.013+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
325	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:47:47.057+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
327	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:47:47.933+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
328	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:47:48.104+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
329	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:47:48.264+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
330	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:47:48.427+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
331	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:48:23.07+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
332	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:48:24.193+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
333	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:49:46.282+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
334	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:57:33.168+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
335	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:58:38.399+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
336	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 06:59:54.808+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
337	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:02:10.676+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
338	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:08.464+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
339	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:21.851+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
340	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:22.708+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
341	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:22.899+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
342	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:23.056+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
343	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:23.21+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
344	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:23.384+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
345	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:34.309+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
346	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:35.402+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
347	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:35.578+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
348	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:35.741+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
349	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:35.91+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
350	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:36.049+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
351	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:36.217+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
352	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:36.349+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
353	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:57.96+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
354	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:04:59.565+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
355	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:05:25.27+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
356	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:43.449+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
357	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:45.343+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
358	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:51.986+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
359	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:53.881+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
360	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:54.061+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
361	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:54.231+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
362	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:54.395+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
363	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:54.808+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
364	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:54.982+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
365	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:55.149+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
366	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:55.321+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
367	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:55.515+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
368	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:55.679+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
369	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:55.843+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
370	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:58.471+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
371	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:58.627+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
372	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:58.797+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
373	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:58.965+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
374	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:59.119+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
375	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:59.283+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
376	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:59.431+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
377	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:59.596+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
378	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:59.764+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
379	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:06:59.914+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
380	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:00.454+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
381	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:41.184+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
382	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:41.732+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
383	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:41.903+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
384	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:42.078+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
385	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:44.119+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
386	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:44.277+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
387	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:44.436+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
388	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:44.611+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
389	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:44.771+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
390	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:44.949+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
391	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:45.124+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
392	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:45.278+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
393	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:45.456+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
394	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:45.645+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
395	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:45.822+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
396	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:45.995+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
397	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:46.177+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
398	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:46.392+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
399	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:46.629+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
400	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:46.839+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
401	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:51.933+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
402	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:52.321+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
403	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:52.495+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
404	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:52.673+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
405	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:52.844+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
406	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:52.98+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
407	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:53.419+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
408	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:53.601+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
409	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:53.771+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
410	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:53.922+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
411	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:07:54.108+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
412	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:11:32.137+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
413	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:11:33.682+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
414	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 07:12:03.42+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
415	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:23:03.031+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	8d684e58-6316-402d-b63f-33af549e64ec	http://localhost:8055
416	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:23:09.712+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	f945e7a0-406e-4bb0-92bd-51c5053d6dc2	http://localhost:8055
417	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:23:19.632+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	http://localhost:8055
418	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.702+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	22	http://localhost:8055
419	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.706+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	21	http://localhost:8055
420	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.713+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	32	http://localhost:8055
421	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.716+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	33	http://localhost:8055
422	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.719+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	23	http://localhost:8055
423	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.719+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	24	http://localhost:8055
424	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.72+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	25	http://localhost:8055
425	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.72+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	31	http://localhost:8055
426	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.721+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	34	http://localhost:8055
427	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.721+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	35	http://localhost:8055
428	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 07:24:50.722+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	http://localhost:8055
429	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.537+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	18	http://localhost:8055
430	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.541+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	37	http://localhost:8055
431	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.543+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	16	http://localhost:8055
432	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.544+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	19	http://localhost:8055
433	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.544+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	20	http://localhost:8055
434	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.545+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	36	http://localhost:8055
435	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.545+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	38	http://localhost:8055
436	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.545+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	39	http://localhost:8055
437	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.546+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_permissions	40	http://localhost:8055
438	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:01:45.547+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	http://localhost:8055
439	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:15:32.228+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	45	http://localhost:8055
440	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:16:21.387+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	46	http://localhost:8055
441	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:16:28.901+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	46	http://localhost:8055
442	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:17:53.593+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	47	http://localhost:8055
443	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:17:57.796+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	47	http://localhost:8055
444	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:18:11.247+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	48	http://localhost:8055
445	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:18:21.486+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	49	http://localhost:8055
446	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:18:51.085+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	50	http://localhost:8055
447	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:19:05.515+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	51	http://localhost:8055
448	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:20:13.279+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
449	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:20:31.027+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
450	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:20:43.13+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
451	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:21:53.042+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
452	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:22:05.045+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	http://localhost:8055
453	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:22:13.753+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	http://localhost:8055
454	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:23:31.442+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	120f41ed-a4fd-490d-97cf-6227795249d1	http://localhost:8055
455	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:23:31.444+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	http://localhost:8055
456	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:23:44.099+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	http://localhost:8055
457	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:23:49.181+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	http://localhost:8055
458	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:47:26.919+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_access	120f41ed-a4fd-490d-97cf-6227795249d1	http://localhost:8055
459	update	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 08:47:26.923+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	http://localhost:8055
460	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 08:55:27.323+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
461	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 08:55:31.747+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
462	login	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-09 09:48:47.581+00	172.22.0.8	node	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	\N
463	create	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-09 09:48:48.114+00	172.22.0.8	node	directus_users	44648516-c025-442d-b23f-7840246c4b6b	\N
464	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.071+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	44	http://localhost:8055
465	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.115+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	40	http://localhost:8055
466	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.15+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	41	http://localhost:8055
467	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.185+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_collections	Staff	http://localhost:8055
468	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.186+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	5	http://localhost:8055
469	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.187+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	6	http://localhost:8055
470	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.187+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	7	http://localhost:8055
471	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.188+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	8	http://localhost:8055
472	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.189+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	9	http://localhost:8055
473	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.189+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	10	http://localhost:8055
474	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.19+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	11	http://localhost:8055
475	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.19+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	12	http://localhost:8055
476	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.191+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	13	http://localhost:8055
477	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.191+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	14	http://localhost:8055
478	delete	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:53:20.192+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	15	http://localhost:8055
479	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:58:17.398+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	52	http://localhost:8055
480	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 09:59:30.153+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	53	http://localhost:8055
481	create	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-09 10:00:08.749+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	directus_fields	54	http://localhost:8055
482	login	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-09 10:03:44.01+00	172.22.0.8	node	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	\N
483	create	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-09 10:03:44.521+00	172.22.0.8	node	directus_users	f17613ee-ba32-4206-97ac-db75ab955e44	\N
484	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:32.701+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
485	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:37.751+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
486	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:38.571+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
487	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:38.779+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
488	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:39.187+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
489	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:39.43+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
490	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:39.664+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
491	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:39.977+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
492	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:40.197+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
493	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:40.718+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
494	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:40.898+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
495	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:41.056+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
496	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:41.228+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
497	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:41.399+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
498	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:41.607+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
499	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:42.105+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
500	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:42.317+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
501	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:42.563+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
502	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:52.114+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
503	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:52.668+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
504	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:56:55.778+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
505	login	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-09 10:57:59.498+00	172.22.0.8	node	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	\N
506	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 10:59:30.411+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
507	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:02:30.606+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
508	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:09:14.016+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
509	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:11:14.596+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
510	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:12:40.862+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
511	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:15:40.989+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
512	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:18:02.389+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
513	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:19:57.959+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
514	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:24:05.103+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
515	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:24:06.974+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
516	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:24:07.361+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
517	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:24:07.518+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
518	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:24:27.8+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
519	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:25:02.362+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
520	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:25:17.541+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
521	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:25:44.373+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
522	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:31:18.926+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
523	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:31:39.972+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
524	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:34:04.288+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
525	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:34:29.318+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
526	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:38:41.213+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
527	login	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-09 11:39:34.74+00	172.22.0.8	node	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	\N
528	login	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-09 11:42:15.197+00	172.22.0.8	node	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	\N
\.


--
-- Data for Name: directus_collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_collections (collection, icon, note, display_template, hidden, singleton, translations, archive_field, archive_app_filter, archive_value, unarchive_value, sort_field, accountability, color, item_duplication_fields, sort, "group", collapse, preview_url, versioning) FROM stdin;
Project	\N	\N	\N	f	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
Task	\N	\N	\N	f	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
Messages	\N	\N	\N	f	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
Task_staff	\N	\N	\N	f	f	\N	\N	t	\N	\N	\N	all	\N	\N	\N	\N	open	\N	f
\.


--
-- Data for Name: directus_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_comments (id, collection, item, comment, date_created, date_updated, user_created, user_updated) FROM stdin;
\.


--
-- Data for Name: directus_dashboards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_dashboards (id, name, icon, note, date_created, user_created, color) FROM stdin;
\.


--
-- Data for Name: directus_extensions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_extensions (enabled, id, folder, source, bundle) FROM stdin;
\.


--
-- Data for Name: directus_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_fields (id, collection, field, special, interface, options, display, display_options, readonly, hidden, sort, width, translations, note, conditions, required, "group", validation, validation_message) FROM stdin;
48	directus_users	resetToken	\N	input	\N	\N	\N	f	f	4	full	\N	\N	\N	f	\N	\N	\N
16	Project	id	uuid	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N
49	directus_users	resetTokenExpiry	\N	input	\N	\N	\N	f	f	5	full	\N	\N	\N	f	\N	\N	\N
18	Project	description	\N	input-multiline	{"trim":true}	\N	\N	f	f	3	full	\N	\N	\N	f	\N	\N	\N
50	directus_users	profileImage	\N	input	\N	\N	\N	f	f	6	full	\N	\N	\N	f	\N	\N	\N
20	Project	deadline	\N	datetime	\N	\N	\N	f	f	5	full	\N	\N	\N	f	\N	\N	\N
21	Project	last_update	\N	datetime	\N	\N	\N	f	f	6	full	\N	\N	\N	f	\N	\N	\N
22	Project	status	\N	select-dropdown	{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"PAUSED","value":"paused"},{"text":"COMPLETED","value":"completed"}]}	\N	\N	f	f	7	full	\N	\N	\N	t	\N	\N	\N
23	Project	document_url	\N	input	\N	\N	\N	f	f	8	full	\N	\N	\N	f	\N	\N	\N
24	Project	clockifyProjectId	\N	input	\N	\N	\N	f	f	9	full	\N	\N	\N	f	\N	\N	\N
25	Task	id	uuid	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N
26	Task	title	\N	input	\N	\N	\N	f	f	2	full	\N	\N	\N	f	\N	\N	\N
17	Project	title	\N	input	\N	\N	\N	f	f	2	full	\N	\N	\N	f	\N	\N	\N
27	Task	description	\N	input-multiline	\N	\N	\N	f	f	3	full	\N	\N	\N	f	\N	\N	\N
51	directus_users	clockifyUserId	\N	input	\N	\N	\N	f	f	7	full	\N	\N	\N	f	\N	\N	\N
52	Task_staff	staff	m2o	select-dropdown-m2o	{"template":"{{first_name}}"}	\N	\N	f	f	3	full	\N	\N	\N	f	\N	\N	\N
53	Messages	receiver	m2o	select-dropdown-m2o	{"template":"{{email}}"}	\N	\N	f	f	5	full	\N	\N	\N	f	\N	\N	\N
54	Messages	sender	m2o	select-dropdown-m2o	{"template":"{{email}}"}	\N	\N	f	f	6	full	\N	\N	\N	f	\N	\N	\N
30	Task	end_date	\N	datetime	\N	\N	\N	f	f	6	full	\N	\N	\N	f	\N	\N	\N
31	Task	completed	cast-boolean	boolean	\N	\N	\N	f	f	7	full	\N	\N	\N	f	\N	\N	\N
33	Task	status	\N	select-dropdown	{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"COMPLETED","value":"completed"}]}	\N	\N	f	f	9	full	\N	\N	\N	t	\N	\N	\N
32	Task	priority	\N	select-dropdown	{"choices":[{"text":"HIGH","value":"high"},{"text":"MEDIUM","value":"medium"},{"text":"LOW","value":"low"}]}	\N	\N	f	f	8	full	\N	\N	\N	f	\N	\N	\N
34	Task	clockifyTaskId	\N	input	\N	\N	\N	f	f	10	full	\N	\N	\N	f	\N	\N	\N
35	Messages	id	uuid	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N
36	Messages	subject	\N	input	\N	\N	\N	f	f	2	full	\N	\N	\N	f	\N	\N	\N
37	Messages	text	\N	input-multiline	{"trim":true}	\N	\N	f	f	3	full	\N	\N	\N	f	\N	\N	\N
39	Task_staff	id	uuid	input	\N	\N	\N	t	t	1	full	\N	\N	\N	f	\N	\N	\N
42	Task	associated_project	m2o	select-dropdown-m2o	\N	\N	\N	f	f	11	full	\N	\N	\N	f	\N	\N	\N
43	Task_staff	task	m2o	select-dropdown-m2o	\N	\N	\N	f	f	2	full	\N	\N	\N	f	\N	\N	\N
19	Project	start_date	date-created	datetime	\N	\N	\N	f	f	4	full	\N	\N	\N	f	\N	\N	\N
38	Messages	sendAt	date-created	datetime	\N	\N	\N	f	f	4	full	\N	\N	\N	f	\N	\N	\N
29	Task	start_date	date-created	datetime	\N	\N	\N	f	f	5	full	\N	\N	\N	f	\N	\N	\N
45	directus_users	phone	\N	input	\N	\N	\N	f	f	1	full	\N	\N	\N	f	\N	\N	\N
46	directus_users	register_date	date-created	datetime	\N	\N	\N	f	f	2	full	\N	\N	\N	f	\N	\N	\N
47	directus_users	type	\N	select-dropdown	{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]}	\N	\N	f	f	3	full	\N	\N	\N	t	\N	\N	\N
\.


--
-- Data for Name: directus_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_files (id, storage, filename_disk, filename_download, title, type, folder, uploaded_by, created_on, modified_by, modified_on, charset, filesize, width, height, duration, embed, description, location, tags, metadata, focal_point_x, focal_point_y, tus_id, tus_data, uploaded_on) FROM stdin;
\.


--
-- Data for Name: directus_flows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_flows (id, name, icon, color, description, status, trigger, accountability, options, operation, date_created, user_created) FROM stdin;
\.


--
-- Data for Name: directus_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_folders (id, name, parent) FROM stdin;
\.


--
-- Data for Name: directus_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_migrations (version, name, "timestamp") FROM stdin;
20201028A	Remove Collection Foreign Keys	2025-05-08 10:41:37.16234+00
20201029A	Remove System Relations	2025-05-08 10:41:37.168816+00
20201029B	Remove System Collections	2025-05-08 10:41:37.173669+00
20201029C	Remove System Fields	2025-05-08 10:41:37.181275+00
20201105A	Add Cascade System Relations	2025-05-08 10:41:37.271229+00
20201105B	Change Webhook URL Type	2025-05-08 10:41:37.285032+00
20210225A	Add Relations Sort Field	2025-05-08 10:41:37.294026+00
20210304A	Remove Locked Fields	2025-05-08 10:41:37.30098+00
20210312A	Webhooks Collections Text	2025-05-08 10:41:37.314095+00
20210331A	Add Refresh Interval	2025-05-08 10:41:37.320825+00
20210415A	Make Filesize Nullable	2025-05-08 10:41:37.336907+00
20210416A	Add Collections Accountability	2025-05-08 10:41:37.344694+00
20210422A	Remove Files Interface	2025-05-08 10:41:37.349189+00
20210506A	Rename Interfaces	2025-05-08 10:41:37.366056+00
20210510A	Restructure Relations	2025-05-08 10:41:37.400053+00
20210518A	Add Foreign Key Constraints	2025-05-08 10:41:37.40787+00
20210519A	Add System Fk Triggers	2025-05-08 10:41:37.457656+00
20210521A	Add Collections Icon Color	2025-05-08 10:41:37.464081+00
20210525A	Add Insights	2025-05-08 10:41:37.486472+00
20210608A	Add Deep Clone Config	2025-05-08 10:41:37.493032+00
20210626A	Change Filesize Bigint	2025-05-08 10:41:37.510157+00
20210716A	Add Conditions to Fields	2025-05-08 10:41:37.516779+00
20210721A	Add Default Folder	2025-05-08 10:41:37.527739+00
20210802A	Replace Groups	2025-05-08 10:41:37.533566+00
20210803A	Add Required to Fields	2025-05-08 10:41:37.539962+00
20210805A	Update Groups	2025-05-08 10:41:37.545535+00
20210805B	Change Image Metadata Structure	2025-05-08 10:41:37.551558+00
20210811A	Add Geometry Config	2025-05-08 10:41:37.558227+00
20210831A	Remove Limit Column	2025-05-08 10:41:37.565157+00
20210903A	Add Auth Provider	2025-05-08 10:41:37.593971+00
20210907A	Webhooks Collections Not Null	2025-05-08 10:41:37.609362+00
20210910A	Move Module Setup	2025-05-08 10:41:37.618743+00
20210920A	Webhooks URL Not Null	2025-05-08 10:41:37.635057+00
20210924A	Add Collection Organization	2025-05-08 10:41:37.647609+00
20210927A	Replace Fields Group	2025-05-08 10:41:37.663713+00
20210927B	Replace M2M Interface	2025-05-08 10:41:37.668208+00
20210929A	Rename Login Action	2025-05-08 10:41:37.672752+00
20211007A	Update Presets	2025-05-08 10:41:37.685696+00
20211009A	Add Auth Data	2025-05-08 10:41:37.692977+00
20211016A	Add Webhook Headers	2025-05-08 10:41:37.699879+00
20211103A	Set Unique to User Token	2025-05-08 10:41:37.706875+00
20211103B	Update Special Geometry	2025-05-08 10:41:37.711688+00
20211104A	Remove Collections Listing	2025-05-08 10:41:37.718667+00
20211118A	Add Notifications	2025-05-08 10:41:37.741685+00
20211211A	Add Shares	2025-05-08 10:41:37.771611+00
20211230A	Add Project Descriptor	2025-05-08 10:41:37.778728+00
20220303A	Remove Default Project Color	2025-05-08 10:41:37.794377+00
20220308A	Add Bookmark Icon and Color	2025-05-08 10:41:37.801153+00
20220314A	Add Translation Strings	2025-05-08 10:41:37.807716+00
20220322A	Rename Field Typecast Flags	2025-05-08 10:41:37.813914+00
20220323A	Add Field Validation	2025-05-08 10:41:37.820659+00
20220325A	Fix Typecast Flags	2025-05-08 10:41:37.82717+00
20220325B	Add Default Language	2025-05-08 10:41:37.84735+00
20220402A	Remove Default Value Panel Icon	2025-05-08 10:41:37.863404+00
20220429A	Add Flows	2025-05-08 10:41:37.900949+00
20220429B	Add Color to Insights Icon	2025-05-08 10:41:37.906885+00
20220429C	Drop Non Null From IP of Activity	2025-05-08 10:41:37.91328+00
20220429D	Drop Non Null From Sender of Notifications	2025-05-08 10:41:37.919721+00
20220614A	Rename Hook Trigger to Event	2025-05-08 10:41:37.92372+00
20220801A	Update Notifications Timestamp Column	2025-05-08 10:41:37.940156+00
20220802A	Add Custom Aspect Ratios	2025-05-08 10:41:37.946612+00
20220826A	Add Origin to Accountability	2025-05-08 10:41:37.955718+00
20230401A	Update Material Icons	2025-05-08 10:41:37.972792+00
20230525A	Add Preview Settings	2025-05-08 10:41:37.979544+00
20230526A	Migrate Translation Strings	2025-05-08 10:41:37.992674+00
20230721A	Require Shares Fields	2025-05-08 10:41:38.003884+00
20230823A	Add Content Versioning	2025-05-08 10:41:38.034026+00
20230927A	Themes	2025-05-08 10:41:38.071583+00
20231009A	Update CSV Fields to Text	2025-05-08 10:41:38.078489+00
20231009B	Update Panel Options	2025-05-08 10:41:38.083292+00
20231010A	Add Extensions	2025-05-08 10:41:38.093985+00
20231215A	Add Focalpoints	2025-05-08 10:41:38.101726+00
20240122A	Add Report URL Fields	2025-05-08 10:41:38.114043+00
20240204A	Marketplace	2025-05-08 10:41:38.16897+00
20240305A	Change Useragent Type	2025-05-08 10:41:38.193029+00
20240311A	Deprecate Webhooks	2025-05-08 10:41:38.209438+00
20240422A	Public Registration	2025-05-08 10:41:38.221225+00
20240515A	Add Session Window	2025-05-08 10:41:38.228144+00
20240701A	Add Tus Data	2025-05-08 10:41:38.235601+00
20240716A	Update Files Date Fields	2025-05-08 10:41:38.248736+00
20240806A	Permissions Policies	2025-05-08 10:41:38.324603+00
20240817A	Update Icon Fields Length	2025-05-08 10:41:38.3997+00
20240909A	Separate Comments	2025-05-08 10:41:38.415419+00
20240909B	Consolidate Content Versioning	2025-05-08 10:41:38.422443+00
20240924A	Migrate Legacy Comments	2025-05-08 10:41:38.432862+00
20240924B	Populate Versioning Deltas	2025-05-08 10:41:38.439936+00
20250224A	Visual Editor	2025-05-08 10:41:38.448335+00
\.


--
-- Data for Name: directus_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_notifications (id, "timestamp", status, recipient, sender, subject, message, collection, item) FROM stdin;
\.


--
-- Data for Name: directus_operations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_operations (id, name, key, type, position_x, position_y, options, resolve, reject, flow, date_created, user_created) FROM stdin;
\.


--
-- Data for Name: directus_panels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_panels (id, dashboard, name, icon, color, show_header, note, type, position_x, position_y, width, height, options, date_created, user_created) FROM stdin;
\.


--
-- Data for Name: directus_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_permissions (id, collection, action, permissions, validation, presets, fields, policy) FROM stdin;
26	Messages	create	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
27	Messages	read	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
28	Messages	update	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
29	Messages	delete	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
30	Messages	share	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
41	directus_users	create	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
42	directus_users	read	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
43	directus_users	update	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
44	directus_users	delete	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
45	directus_users	share	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
22	Project	read	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
21	Project	create	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
32	Task	read	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
33	Task	update	\N	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
37	Task_staff	read	{"_and":[{"id":{"_eq":"$CURRENT_USER"}}]}	\N	\N	*	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a
\.


--
-- Data for Name: directus_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_policies (id, name, icon, description, ip_access, enforce_tfa, admin_access, app_access) FROM stdin;
839e307f-de45-4dd6-9715-818dbc2103ef	Administrator	verified	$t:admin_description	\N	f	t	t
abf8a154-5b1c-4a46-ac9c-7300570f4f17	$t:public_label	public	$t:public_description	\N	f	t	t
47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	PoliticaStaff	badge	Politica de prueba con todos los permisos	\N	f	f	t
\.


--
-- Data for Name: directus_presets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_presets (id, bookmark, "user", role, collection, search, layout, layout_query, layout_options, refresh_interval, filter, icon, color) FROM stdin;
3	\N	3d59b549-1665-4368-8631-586f02ea12e5	\N	directus_users	\N	cards	{"cards":{"sort":["email"],"page":1}}	{"cards":{"icon":"account_circle","title":"{{ first_name }} {{ last_name }}","subtitle":"{{ email }}","size":4}}	\N	\N	bookmark	\N
4	\N	3d59b549-1665-4368-8631-586f02ea12e5	\N	directus_activity	\N	tabular	{"tabular":{"sort":["-timestamp"],"fields":["action","collection","timestamp","user"],"page":1}}	{"tabular":{"widths":{"action":120,"collection":210,"timestamp":240,"user":240}}}	\N	\N	bookmark	\N
\.


--
-- Data for Name: directus_relations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_relations (id, many_collection, many_field, one_collection, one_field, one_collection_field, one_allowed_collections, junction_field, sort_field, one_deselect_action) FROM stdin;
3	Task	associated_project	Project	\N	\N	\N	\N	\N	nullify
4	Task_staff	task	Task	\N	\N	\N	\N	\N	nullify
6	Task_staff	staff	directus_users	\N	\N	\N	\N	\N	nullify
7	Messages	receiver	directus_users	\N	\N	\N	\N	\N	nullify
8	Messages	sender	directus_users	\N	\N	\N	\N	\N	nullify
\.


--
-- Data for Name: directus_revisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_revisions (id, activity, collection, item, data, delta, parent, version) FROM stdin;
1	2	directus_fields	1	{"sort":1,"hidden":true,"interface":"input","readonly":true,"field":"id","collection":"frf"}	{"sort":1,"hidden":true,"interface":"input","readonly":true,"field":"id","collection":"frf"}	\N	\N
2	3	directus_collections	frf	{"singleton":false,"collection":"frf"}	{"singleton":false,"collection":"frf"}	\N	\N
3	6	directus_fields	2	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Staff2"}	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Staff2"}	\N	\N
4	7	directus_collections	Staff2	{"singleton":false,"collection":"Staff2"}	{"singleton":false,"collection":"Staff2"}	\N	\N
5	8	directus_fields	3	{"sort":2,"interface":"input","special":null,"required":true,"collection":"Staff2","field":"email"}	{"sort":2,"interface":"input","special":null,"required":true,"collection":"Staff2","field":"email"}	\N	\N
6	9	directus_fields	4	{"sort":3,"interface":"input","special":null,"required":true,"collection":"Staff2","field":"password"}	{"sort":3,"interface":"input","special":null,"required":true,"collection":"Staff2","field":"password"}	\N	\N
7	14	directus_fields	5	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Staff"}	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Staff"}	\N	\N
8	15	directus_collections	Staff	{"singleton":false,"collection":"Staff"}	{"singleton":false,"collection":"Staff"}	\N	\N
9	16	directus_fields	6	{"sort":2,"interface":"input","special":null,"collection":"Staff","field":"name"}	{"sort":2,"interface":"input","special":null,"collection":"Staff","field":"name"}	\N	\N
10	17	directus_fields	7	{"sort":3,"interface":"input","special":null,"collection":"Staff","field":"email"}	{"sort":3,"interface":"input","special":null,"collection":"Staff","field":"email"}	\N	\N
11	18	directus_fields	7	{"id":7,"collection":"Staff","field":"email","special":null,"interface":"input","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":3,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Staff","field":"email","required":true}	\N	\N
12	19	directus_fields	8	{"sort":4,"interface":"input","special":null,"collection":"Staff","field":"phone"}	{"sort":4,"interface":"input","special":null,"collection":"Staff","field":"phone"}	\N	\N
13	20	directus_fields	8	{"id":8,"collection":"Staff","field":"phone","special":null,"interface":"input","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Staff","field":"phone","required":false}	\N	\N
14	21	directus_fields	9	{"sort":5,"interface":"input","special":null,"required":true,"collection":"Staff","field":"password"}	{"sort":5,"interface":"input","special":null,"required":true,"collection":"Staff","field":"password"}	\N	\N
15	22	directus_fields	10	{"sort":6,"interface":"datetime","special":null,"required":true,"collection":"Staff","field":"register_date"}	{"sort":6,"interface":"datetime","special":null,"required":true,"collection":"Staff","field":"register_date"}	\N	\N
16	23	directus_fields	10	{"id":10,"collection":"Staff","field":"register_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":6,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Staff","field":"register_date","special":["date-created"]}	\N	\N
17	24	directus_fields	11	{"sort":7,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]},"collection":"Staff","field":"type"}	{"sort":7,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]},"collection":"Staff","field":"type"}	\N	\N
18	25	directus_fields	11	{"id":11,"collection":"Staff","field":"type","special":null,"interface":"select-dropdown","options":{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":7,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Staff","field":"type","required":true}	\N	\N
19	26	directus_fields	12	{"sort":8,"interface":"input","special":null,"collection":"Staff","field":"resetToken"}	{"sort":8,"interface":"input","special":null,"collection":"Staff","field":"resetToken"}	\N	\N
20	27	directus_fields	13	{"sort":9,"interface":"input","special":null,"collection":"Staff","field":"resetTokenExpiry"}	{"sort":9,"interface":"input","special":null,"collection":"Staff","field":"resetTokenExpiry"}	\N	\N
21	28	directus_fields	14	{"sort":10,"interface":"input","special":null,"collection":"Staff","field":"profileImage"}	{"sort":10,"interface":"input","special":null,"collection":"Staff","field":"profileImage"}	\N	\N
22	29	directus_fields	15	{"sort":11,"interface":"input","special":null,"collection":"Staff","field":"clockifyUserId"}	{"sort":11,"interface":"input","special":null,"collection":"Staff","field":"clockifyUserId"}	\N	\N
23	30	directus_fields	16	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Project"}	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Project"}	\N	\N
24	31	directus_collections	Project	{"singleton":false,"collection":"Project"}	{"singleton":false,"collection":"Project"}	\N	\N
25	32	directus_fields	17	{"sort":2,"interface":"input","special":null,"collection":"Project","field":"title"}	{"sort":2,"interface":"input","special":null,"collection":"Project","field":"title"}	\N	\N
26	33	directus_fields	17	{"id":17,"collection":"Project","field":"title","special":null,"interface":"input","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":2,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Project","field":"title","required":true}	\N	\N
27	34	directus_fields	18	{"sort":3,"interface":"input-multiline","special":null,"options":{"trim":true},"collection":"Project","field":"description"}	{"sort":3,"interface":"input-multiline","special":null,"options":{"trim":true},"collection":"Project","field":"description"}	\N	\N
28	35	directus_fields	19	{"sort":4,"interface":"datetime","special":null,"required":true,"collection":"Project","field":"start_date"}	{"sort":4,"interface":"datetime","special":null,"required":true,"collection":"Project","field":"start_date"}	\N	\N
75	82	Project	2674e6ed-0779-4afe-b9cd-a74ad55c0605	{"title":"P1"}	{"title":"P1"}	\N	\N
29	36	directus_fields	19	{"id":19,"collection":"Project","field":"start_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Project","field":"start_date","special":["date-created"]}	\N	\N
30	37	directus_fields	20	{"sort":5,"interface":"datetime","special":null,"collection":"Project","field":"deadline"}	{"sort":5,"interface":"datetime","special":null,"collection":"Project","field":"deadline"}	\N	\N
31	38	directus_fields	21	{"sort":6,"interface":"datetime","special":null,"collection":"Project","field":"last_update"}	{"sort":6,"interface":"datetime","special":null,"collection":"Project","field":"last_update"}	\N	\N
32	39	directus_fields	22	{"sort":7,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"PAUSED","value":"paused"},{"text":"COMPLETED","value":"completed"}]},"collection":"Project","field":"status"}	{"sort":7,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"PAUSED","value":"paused"},{"text":"COMPLETED","value":"completed"}]},"collection":"Project","field":"status"}	\N	\N
33	40	directus_fields	22	{"id":22,"collection":"Project","field":"status","special":null,"interface":"select-dropdown","options":{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"PAUSED","value":"paused"},{"text":"COMPLETED","value":"completed"}]},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":7,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Project","field":"status","required":true}	\N	\N
34	41	directus_fields	23	{"sort":8,"interface":"input","special":null,"collection":"Project","field":"document_url"}	{"sort":8,"interface":"input","special":null,"collection":"Project","field":"document_url"}	\N	\N
35	42	directus_fields	24	{"sort":9,"interface":"input","special":null,"collection":"Project","field":"clockifyProjectId"}	{"sort":9,"interface":"input","special":null,"collection":"Project","field":"clockifyProjectId"}	\N	\N
36	43	directus_fields	25	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Task"}	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Task"}	\N	\N
37	44	directus_collections	Task	{"singleton":false,"collection":"Task"}	{"singleton":false,"collection":"Task"}	\N	\N
38	45	directus_fields	26	{"sort":2,"interface":"input","special":null,"required":false,"collection":"Task","field":"title"}	{"sort":2,"interface":"input","special":null,"required":false,"collection":"Task","field":"title"}	\N	\N
40	47	directus_fields	27	{"sort":3,"interface":"input-multiline","special":null,"collection":"Task","field":"description"}	{"sort":3,"interface":"input-multiline","special":null,"collection":"Task","field":"description"}	\N	\N
41	48	directus_fields	28	{"sort":4,"interface":"input","special":null,"collection":"Task","field":"associated_project_id"}	{"sort":4,"interface":"input","special":null,"collection":"Task","field":"associated_project_id"}	\N	\N
42	49	directus_fields	28	{"id":28,"collection":"Task","field":"associated_project_id","special":null,"interface":"input","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"associated_project_id","required":true}	\N	\N
43	50	directus_fields	28	{"id":28,"collection":"Task","field":"associated_project_id","special":null,"interface":"input","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"associated_project_id","required":false}	\N	\N
44	51	directus_fields	29	{"sort":5,"interface":"datetime","special":null,"collection":"Task","field":"start_date"}	{"sort":5,"interface":"datetime","special":null,"collection":"Task","field":"start_date"}	\N	\N
45	52	directus_fields	29	{"id":29,"collection":"Task","field":"start_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":5,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"start_date","special":["date-created"],"required":true}	\N	\N
46	53	directus_fields	30	{"sort":6,"interface":"datetime","special":null,"required":true,"collection":"Task","field":"end_date"}	{"sort":6,"interface":"datetime","special":null,"required":true,"collection":"Task","field":"end_date"}	\N	\N
47	54	directus_fields	30	{"id":30,"collection":"Task","field":"end_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":6,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"end_date","special":["date-created"]}	\N	\N
48	55	directus_fields	30	{"id":30,"collection":"Task","field":"end_date","special":null,"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":6,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"end_date","special":null,"required":false}	\N	\N
49	56	directus_fields	31	{"sort":7,"interface":"boolean","special":["cast-boolean"],"collection":"Task","field":"completed"}	{"sort":7,"interface":"boolean","special":["cast-boolean"],"collection":"Task","field":"completed"}	\N	\N
50	57	directus_fields	32	{"sort":8,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"HIGH","value":"high"},{"text":"MEDIUM","value":"medium"},{"text":"LOW","value":"low"}]},"collection":"Task","field":"priority"}	{"sort":8,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"HIGH","value":"high"},{"text":"MEDIUM","value":"medium"},{"text":"LOW","value":"low"}]},"collection":"Task","field":"priority"}	\N	\N
51	58	directus_fields	32	{"id":32,"collection":"Task","field":"priority","special":null,"interface":"select-dropdown","options":{"choices":[{"text":"HIGH","value":"high"},{"text":"MEDIUM","value":"medium"},{"text":"LOW","value":"low"}]},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":8,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"priority","required":true}	\N	\N
39	46	directus_fields	17	{"id":17,"collection":"Project","field":"title","special":null,"interface":"input","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":2,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Project","field":"title","required":false}	\N	\N
52	59	directus_fields	33	{"sort":9,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"COMPLETED","value":"completed"}]},"collection":"Task","field":"status"}	{"sort":9,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"COMPLETED","value":"completed"}]},"collection":"Task","field":"status"}	\N	\N
53	60	directus_fields	33	{"id":33,"collection":"Task","field":"status","special":null,"interface":"select-dropdown","options":{"choices":[{"text":"PENDING","value":"pending"},{"text":"ACTIVE","value":"active"},{"text":"COMPLETED","value":"completed"}]},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":9,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"status","required":true}	\N	\N
54	61	directus_fields	32	{"id":32,"collection":"Task","field":"priority","special":null,"interface":"select-dropdown","options":{"choices":[{"text":"HIGH","value":"high"},{"text":"MEDIUM","value":"medium"},{"text":"LOW","value":"low"}]},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":8,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"priority","required":false}	\N	\N
55	62	directus_fields	34	{"sort":10,"interface":"input","special":null,"collection":"Task","field":"clockifyTaskId"}	{"sort":10,"interface":"input","special":null,"collection":"Task","field":"clockifyTaskId"}	\N	\N
56	63	directus_fields	35	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Messages"}	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Messages"}	\N	\N
57	64	directus_collections	Messages	{"singleton":false,"collection":"Messages"}	{"singleton":false,"collection":"Messages"}	\N	\N
58	65	directus_fields	36	{"sort":2,"interface":"input","special":null,"collection":"Messages","field":"subject"}	{"sort":2,"interface":"input","special":null,"collection":"Messages","field":"subject"}	\N	\N
59	66	directus_fields	37	{"sort":3,"interface":"input-multiline","special":null,"collection":"Messages","field":"text"}	{"sort":3,"interface":"input-multiline","special":null,"collection":"Messages","field":"text"}	\N	\N
60	67	directus_fields	37	{"id":37,"collection":"Messages","field":"text","special":null,"interface":"input-multiline","options":{"trim":true},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":3,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Messages","field":"text","options":{"trim":true}}	\N	\N
61	68	directus_fields	38	{"sort":4,"interface":"datetime","special":null,"collection":"Messages","field":"sendAt"}	{"sort":4,"interface":"datetime","special":null,"collection":"Messages","field":"sendAt"}	\N	\N
62	69	directus_fields	38	{"id":38,"collection":"Messages","field":"sendAt","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"Messages","field":"sendAt","special":["date-created"],"required":true}	\N	\N
63	70	directus_fields	39	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Task_staff"}	{"sort":1,"hidden":true,"readonly":true,"interface":"input","special":["uuid"],"field":"id","collection":"Task_staff"}	\N	\N
64	71	directus_collections	Task_staff	{"singleton":false,"collection":"Task_staff"}	{"singleton":false,"collection":"Task_staff"}	\N	\N
65	72	directus_fields	40	{"sort":5,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"sender"}	{"sort":5,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"sender"}	\N	\N
66	73	directus_fields	41	{"sort":6,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"receiver"}	{"sort":6,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"receiver"}	\N	\N
67	74	directus_fields	42	{"sort":11,"interface":"select-dropdown-m2o","special":["m2o"],"collection":"Task","field":"associated_project"}	{"sort":11,"interface":"select-dropdown-m2o","special":["m2o"],"collection":"Task","field":"associated_project"}	\N	\N
68	75	directus_fields	43	{"sort":2,"interface":"select-dropdown-m2o","special":["m2o"],"collection":"Task_staff","field":"task"}	{"sort":2,"interface":"select-dropdown-m2o","special":["m2o"],"collection":"Task_staff","field":"task"}	\N	\N
69	76	directus_fields	44	{"sort":3,"interface":"select-dropdown-m2o","special":["m2o"],"collection":"Task_staff","field":"staff"}	{"sort":3,"interface":"select-dropdown-m2o","special":["m2o"],"collection":"Task_staff","field":"staff"}	\N	\N
70	77	directus_fields	10	{"id":10,"collection":"Staff","field":"register_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":6,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Staff","field":"register_date","required":false}	\N	\N
72	79	directus_fields	19	{"id":19,"collection":"Project","field":"start_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Project","field":"start_date","required":false}	\N	\N
73	80	directus_fields	38	{"id":38,"collection":"Messages","field":"sendAt","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":4,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Messages","field":"sendAt","required":false}	\N	\N
74	81	directus_fields	29	{"id":29,"collection":"Task","field":"start_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":5,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"Task","field":"start_date","required":false}	\N	\N
76	84	Task	b6d9a9c6-ac6c-4533-92b6-248efb111401	{"title":"t1","associated_project":"2674e6ed-0779-4afe-b9cd-a74ad55c0605","priority":"medium"}	{"title":"t1","associated_project":"2674e6ed-0779-4afe-b9cd-a74ad55c0605","priority":"medium"}	\N	\N
77	85	Task_staff	ad7aa93e-ea6c-4390-99d3-69944dd48e01	{"task":"b6d9a9c6-ac6c-4533-92b6-248efb111401","staff":"f5fe3f20-ebdc-4b6a-8e50-630cb12d7a8d"}	{"task":"b6d9a9c6-ac6c-4533-92b6-248efb111401","staff":"f5fe3f20-ebdc-4b6a-8e50-630cb12d7a8d"}	\N	\N
79	87	Messages	5096b02a-9133-4263-9e98-3465cc81c91c	{"sender":"13f3f0a0-f25e-4c21-9fc8-af5302eb2874","receiver":"f5fe3f20-ebdc-4b6a-8e50-630cb12d7a8d","text":"dewdq3we"}	{"sender":"13f3f0a0-f25e-4c21-9fc8-af5302eb2874","receiver":"f5fe3f20-ebdc-4b6a-8e50-630cb12d7a8d","text":"dewdq3we"}	\N	\N
80	94	directus_permissions	1	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	\N	\N
81	95	directus_permissions	2	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	\N	\N
82	96	directus_permissions	3	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	\N	\N
83	97	directus_permissions	4	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	\N	\N
84	98	directus_permissions	5	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	\N	\N
85	100	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	{"id":"16c217b4-040c-46a6-ba90-949fac9618dd","role":null,"user":null,"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
86	102	directus_access	fe9a601b-b6bd-4cd7-b4b7-59a2bedf8b5a	{"policy":"839e307f-de45-4dd6-9715-818dbc2103ef","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}	{"policy":"839e307f-de45-4dd6-9715-818dbc2103ef","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}	\N	\N
87	104	directus_access	27ade98e-29d4-489f-b701-2fc0ebf3418b	{"id":"27ade98e-29d4-489f-b701-2fc0ebf3418b","role":"fd0935c8-df79-4771-84c9-c73875fdd763","user":null,"policy":"839e307f-de45-4dd6-9715-818dbc2103ef","sort":null}	{"policy":"839e307f-de45-4dd6-9715-818dbc2103ef"}	\N	\N
88	109	directus_access	96472733-e620-4515-85f5-3e7fc490e08a	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}	\N	\N
89	110	directus_access	5efc55e0-70db-4e72-acc3-1788b70071f9	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}	\N	\N
90	112	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	{"id":"16c217b4-040c-46a6-ba90-949fac9618dd","role":null,"user":null,"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
91	114	directus_access	96472733-e620-4515-85f5-3e7fc490e08a	{"id":"96472733-e620-4515-85f5-3e7fc490e08a","role":"fd0935c8-df79-4771-84c9-c73875fdd763","user":null,"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":null}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
92	118	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	{"id":"16c217b4-040c-46a6-ba90-949fac9618dd","role":null,"user":null,"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
93	119	directus_access	27ade98e-29d4-489f-b701-2fc0ebf3418b	{"id":"27ade98e-29d4-489f-b701-2fc0ebf3418b","role":"fd0935c8-df79-4771-84c9-c73875fdd763","user":null,"policy":"839e307f-de45-4dd6-9715-818dbc2103ef","sort":null}	{"policy":"839e307f-de45-4dd6-9715-818dbc2103ef"}	\N	\N
94	123	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	{"id":"16c217b4-040c-46a6-ba90-949fac9618dd","role":null,"user":null,"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
95	127	directus_access	977b67ea-1c04-4f06-9a6b-e71194cc07a2	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}	102	\N
96	128	directus_permissions	6	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	102	\N
97	129	directus_permissions	7	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	102	\N
98	130	directus_permissions	8	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	102	\N
99	131	directus_permissions	9	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	102	\N
100	132	directus_permissions	10	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	102	\N
101	133	directus_access	70df60da-c89c-4257-8ee9-7c77cb2a0d53	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}	102	\N
103	135	directus_access	27cd3188-cfd1-497c-89b8-ac2207d242a6	{"policy":{"name":"Admin","description":"Dar todos los permisos de las colecciones no internas de Directus","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}],"update":[],"delete":[]}},"sort":1,"role":"fd0935c8-df79-4771-84c9-c73875fdd763"}	{"policy":{"name":"Admin","description":"Dar todos los permisos de las colecciones no internas de Directus","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}],"update":[],"delete":[]}},"sort":1,"role":"fd0935c8-df79-4771-84c9-c73875fdd763"}	\N	\N
102	134	directus_policies	f945e7a0-406e-4bb0-92bd-51c5053d6dc2	{"name":"Admin","description":"Dar todos los permisos de las colecciones no internas de Directus","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}],"update":[],"delete":[]}}	{"name":"Admin","description":"Dar todos los permisos de las colecciones no internas de Directus","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"a4588c22-c82e-4f17-a623-e2c159646e80"}}],"update":[],"delete":[]}}	103	\N
104	141	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	{"email":"xilax32213@bocapies.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"invited"}	{"email":"xilax32213@bocapies.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"invited"}	\N	\N
105	142	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	{"id":"84e289eb-953f-4892-936f-e3c7c22dfbe8","first_name":null,"last_name":null,"email":"xilax32213@bocapies.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"invited","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":[]}	{"password":"**********"}	\N	\N
106	143	directus_users	84e289eb-953f-4892-936f-e3c7c22dfbe8	{"id":"84e289eb-953f-4892-936f-e3c7c22dfbe8","first_name":"ApiUser","last_name":null,"email":"xilax32213@bocapies.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"invited","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":[]}	{"first_name":"ApiUser"}	\N	\N
107	144	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	{"email":"apiuser@example.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"invited"}	{"email":"apiuser@example.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"invited"}	\N	\N
108	145	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	{"id":"7136fddd-4146-40f5-b506-25b77ededdf5","first_name":"ApiUser","last_name":null,"email":"apiuser@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"invited","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":[]}	{"first_name":"ApiUser","password":"**********"}	\N	\N
109	147	directus_access	27cd3188-cfd1-497c-89b8-ac2207d242a6	{"id":"27cd3188-cfd1-497c-89b8-ac2207d242a6","role":"fd0935c8-df79-4771-84c9-c73875fdd763","user":null,"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2","sort":1}	{"policy":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2"}	\N	\N
110	150	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	{"id":"7136fddd-4146-40f5-b506-25b77ededdf5","first_name":"ApiUser","last_name":null,"email":"apiuser@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":[]}	{"status":"active"}	\N	\N
111	163	directus_access	ac28245e-f495-446e-a4ab-525e77ccec0f	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}	118	\N
112	164	directus_permissions	11	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	118	\N
113	165	directus_permissions	12	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	118	\N
114	166	directus_permissions	13	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	118	\N
115	167	directus_permissions	14	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	118	\N
116	168	directus_permissions	15	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	118	\N
117	169	directus_access	42862065-3e92-49eb-91b5-23a9f4aab3f9	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","user":{"id":"7136fddd-4146-40f5-b506-25b77ededdf5"}}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec","user":{"id":"7136fddd-4146-40f5-b506-25b77ededdf5"}}	118	\N
119	171	directus_access	ffa3c725-d77b-4002-9cfd-d507b9d041fd	{"policy":{"name":"nueva","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"7136fddd-4146-40f5-b506-25b77ededdf5"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]}},"sort":1,"role":"fd0935c8-df79-4771-84c9-c73875fdd763"}	{"policy":{"name":"nueva","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"7136fddd-4146-40f5-b506-25b77ededdf5"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]}},"sort":1,"role":"fd0935c8-df79-4771-84c9-c73875fdd763"}	\N	\N
118	170	directus_policies	8d684e58-6316-402d-b63f-33af549e64ec	{"name":"nueva","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"7136fddd-4146-40f5-b506-25b77ededdf5"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]}}	{"name":"nueva","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}],"update":[],"delete":[]},"users":{"create":[{"policy":"+","user":{"id":"7136fddd-4146-40f5-b506-25b77ededdf5"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"fd0935c8-df79-4771-84c9-c73875fdd763"}}],"update":[],"delete":[]}}	119	\N
120	183	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	{"email":"admin@example.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"invited"}	{"email":"admin@example.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"invited"}	\N	\N
124	187	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	{"id":"3d59b549-1665-4368-8631-586f02ea12e5","first_name":null,"last_name":null,"email":"admin@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":["85fc0bb1-a53d-476e-bf24-e41dd84e039d","c504421c-a3f1-4106-8535-f9b07604141f","e18a6743-07ba-4315-baec-30f03fb7c469"]}	{"password":"**********","status":"active"}	\N	\N
121	184	directus_access	85fc0bb1-a53d-476e-bf24-e41dd84e039d	{"user":"3d59b549-1665-4368-8631-586f02ea12e5","policy":{"id":"8d684e58-6316-402d-b63f-33af549e64ec"},"sort":1}	{"user":"3d59b549-1665-4368-8631-586f02ea12e5","policy":{"id":"8d684e58-6316-402d-b63f-33af549e64ec"},"sort":1}	124	\N
122	185	directus_access	c504421c-a3f1-4106-8535-f9b07604141f	{"user":"3d59b549-1665-4368-8631-586f02ea12e5","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"},"sort":2}	{"user":"3d59b549-1665-4368-8631-586f02ea12e5","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"},"sort":2}	124	\N
123	186	directus_access	e18a6743-07ba-4315-baec-30f03fb7c469	{"user":"3d59b549-1665-4368-8631-586f02ea12e5","policy":{"id":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2"},"sort":3}	{"user":"3d59b549-1665-4368-8631-586f02ea12e5","policy":{"id":"f945e7a0-406e-4bb0-92bd-51c5053d6dc2"},"sort":3}	124	\N
125	188	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	{"id":"3d59b549-1665-4368-8631-586f02ea12e5","first_name":"Admin","last_name":"Admin","email":"admin@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":["85fc0bb1-a53d-476e-bf24-e41dd84e039d","c504421c-a3f1-4106-8535-f9b07604141f","e18a6743-07ba-4315-baec-30f03fb7c469"]}	{"first_name":"Admin","last_name":"Admin"}	\N	\N
127	197	directus_access	42862065-3e92-49eb-91b5-23a9f4aab3f9	{"id":"42862065-3e92-49eb-91b5-23a9f4aab3f9","role":null,"user":"7136fddd-4146-40f5-b506-25b77ededdf5","policy":"8d684e58-6316-402d-b63f-33af549e64ec","sort":null}	{"policy":"8d684e58-6316-402d-b63f-33af549e64ec"}	\N	\N
126	196	directus_policies	8d684e58-6316-402d-b63f-33af549e64ec	{"id":"8d684e58-6316-402d-b63f-33af549e64ec","name":"nueva","icon":"badge","description":null,"ip_access":null,"enforce_tfa":false,"admin_access":false,"app_access":true,"permissions":[11,12,13,14,15],"users":["85fc0bb1-a53d-476e-bf24-e41dd84e039d","ac28245e-f495-446e-a4ab-525e77ccec0f","42862065-3e92-49eb-91b5-23a9f4aab3f9"],"roles":["85fc0bb1-a53d-476e-bf24-e41dd84e039d","ac28245e-f495-446e-a4ab-525e77ccec0f","42862065-3e92-49eb-91b5-23a9f4aab3f9"]}	{"app_access":true}	127	\N
128	200	directus_access	c1e7917b-f4d5-4ef9-baee-bff3f7c79398	{"user":"7136fddd-4146-40f5-b506-25b77ededdf5","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"},"sort":1}	{"user":"7136fddd-4146-40f5-b506-25b77ededdf5","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"},"sort":1}	\N	\N
130	207	directus_access	16c217b4-040c-46a6-ba90-949fac9618dd	{"id":"16c217b4-040c-46a6-ba90-949fac9618dd","role":null,"user":null,"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
129	206	directus_policies	abf8a154-5b1c-4a46-ac9c-7300570f4f17	{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","name":"$t:public_label","icon":"public","description":"$t:public_description","ip_access":null,"enforce_tfa":false,"admin_access":true,"app_access":true,"permissions":[1,2,3,4,5],"users":["16c217b4-040c-46a6-ba90-949fac9618dd","c1e7917b-f4d5-4ef9-baee-bff3f7c79398"],"roles":["16c217b4-040c-46a6-ba90-949fac9618dd","c1e7917b-f4d5-4ef9-baee-bff3f7c79398"]}	{"admin_access":true,"app_access":true}	130	\N
132	218	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	{"first_name":"maite","email":"maite@gmail.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","policies":{"create":[{"user":"+","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}}],"update":[],"delete":[]},"password":"**********"}	{"first_name":"maite","email":"maite@gmail.com","role":"fd0935c8-df79-4771-84c9-c73875fdd763","policies":{"create":[{"user":"+","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}}],"update":[],"delete":[]},"password":"**********"}	\N	\N
131	217	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	{"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"},"sort":1}	{"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"},"sort":1}	132	\N
133	220	directus_access	6398e22d-ba9b-47d3-81eb-407142fcf069	{"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"},"sort":2}	{"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"},"sort":2}	\N	\N
134	221	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	{"id":"19cabe9b-af16-4170-89bb-0d6edc1b3c4b","role":null,"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
135	239	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	{"name":"StaffRole"}	{"name":"StaffRole"}	\N	\N
138	242	directus_roles	4256f46d-8fe5-4a49-92b8-310645edb13f	{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f","name":"StaffRole","icon":"supervised_user_circle","description":"Rol de usuario normal (prueba)","parent":null,"children":[],"policies":["fc863c4b-1eeb-4d38-8d9c-781cc3a76c45"],"users":["ccd2cde6-bda7-46d3-8658-760a82e3f952"]}	{"description":"Rol de usuario normal (prueba)"}	\N	\N
136	240	directus_access	fc863c4b-1eeb-4d38-8d9c-781cc3a76c45	{"role":"4256f46d-8fe5-4a49-92b8-310645edb13f","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"},"sort":1}	{"role":"4256f46d-8fe5-4a49-92b8-310645edb13f","policy":{"id":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"},"sort":1}	138	\N
137	241	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952","first_name":"maite","last_name":null,"email":"maite@gmail.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","token":null,"last_access":"2025-05-09T06:10:54.866Z","last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"policies":["19cabe9b-af16-4170-89bb-0d6edc1b3c4b","6398e22d-ba9b-47d3-81eb-407142fcf069"]}	{"role":"4256f46d-8fe5-4a49-92b8-310645edb13f"}	138	\N
139	245	directus_access	19cabe9b-af16-4170-89bb-0d6edc1b3c4b	{"id":"19cabe9b-af16-4170-89bb-0d6edc1b3c4b","role":null,"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17","sort":1}	{"policy":"abf8a154-5b1c-4a46-ac9c-7300570f4f17"}	\N	\N
140	255	directus_access	2b313a97-8a94-4133-a3a3-c41d43cefa88	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","role":{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f"}}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","role":{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f"}}	162	\N
141	256	directus_permissions	16	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"}	162	\N
161	276	directus_access	b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","user":{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952"}}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","user":{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952"}}	162	\N
142	257	directus_permissions	17	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"}	162	\N
143	258	directus_permissions	18	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"}	162	\N
144	259	directus_permissions	19	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"}	162	\N
145	260	directus_permissions	20	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"}	162	\N
146	261	directus_permissions	21	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"create"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"create"}	162	\N
147	262	directus_permissions	22	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"read"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"read"}	162	\N
148	263	directus_permissions	23	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"update"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"update"}	162	\N
149	264	directus_permissions	24	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"delete"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"delete"}	162	\N
150	265	directus_permissions	25	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"share"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"share"}	162	\N
151	266	directus_permissions	26	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"create"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"create"}	162	\N
152	267	directus_permissions	27	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"read"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"read"}	162	\N
153	268	directus_permissions	28	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"update"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"update"}	162	\N
154	269	directus_permissions	29	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"delete"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"delete"}	162	\N
155	270	directus_permissions	30	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"share"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"share"}	162	\N
156	271	directus_permissions	31	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"create"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"create"}	162	\N
157	272	directus_permissions	32	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"read"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"read"}	162	\N
158	273	directus_permissions	33	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"update"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"update"}	162	\N
159	274	directus_permissions	34	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"delete"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"delete"}	162	\N
160	275	directus_permissions	35	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"share"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"share"}	162	\N
179	419	directus_permissions	21	{"id":21,"collection":"Project","action":"create","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	{"collection":"Project","action":"create","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
163	278	directus_access	b4ff35bf-e7ca-4555-9a24-a5f1393d4d12	{"policy":{"name":"PolicticaStaff","description":"Politica de prueba con todos los permisos","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"share"}],"update":[],"delete":[]},"app_access":true,"users":{"create":[{"policy":"+","user":{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f"}}],"update":[],"delete":[]}},"sort":2,"role":"4256f46d-8fe5-4a49-92b8-310645edb13f"}	{"policy":{"name":"PolicticaStaff","description":"Politica de prueba con todos los permisos","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"share"}],"update":[],"delete":[]},"app_access":true,"users":{"create":[{"policy":"+","user":{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f"}}],"update":[],"delete":[]}},"sort":2,"role":"4256f46d-8fe5-4a49-92b8-310645edb13f"}	\N	\N
162	277	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	{"name":"PolicticaStaff","description":"Politica de prueba con todos los permisos","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"share"}],"update":[],"delete":[]},"app_access":true,"users":{"create":[{"policy":"+","user":{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f"}}],"update":[],"delete":[]}}	{"name":"PolicticaStaff","description":"Politica de prueba con todos los permisos","permissions":{"create":[{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Staff","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Project","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Messages","action":"share"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"create"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"read"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"update"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"delete"},{"policy":"+","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task","action":"share"}],"update":[],"delete":[]},"app_access":true,"users":{"create":[{"policy":"+","user":{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952"}}],"update":[],"delete":[]},"roles":{"create":[{"policy":"+","role":{"id":"4256f46d-8fe5-4a49-92b8-310645edb13f"}}],"update":[],"delete":[]}}	163	\N
164	284	directus_permissions	36	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"create"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"create"}	\N	\N
165	285	directus_permissions	37	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"read"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"read"}	\N	\N
166	286	directus_permissions	38	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"update"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"update"}	\N	\N
167	287	directus_permissions	39	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"delete"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"delete"}	\N	\N
168	288	directus_permissions	40	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"share"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"Task_staff","action":"share"}	\N	\N
169	290	directus_access	2b313a97-8a94-4133-a3a3-c41d43cefa88	{"id":"2b313a97-8a94-4133-a3a3-c41d43cefa88","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","user":null,"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","sort":null}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
170	308	directus_access	2b313a97-8a94-4133-a3a3-c41d43cefa88	{"id":"2b313a97-8a94-4133-a3a3-c41d43cefa88","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","user":null,"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","sort":null}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
171	312	directus_permissions	41	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"create"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"create"}	\N	\N
172	313	directus_permissions	42	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"read"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"read"}	\N	\N
173	314	directus_permissions	43	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"update"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"update"}	\N	\N
174	315	directus_permissions	44	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"delete"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"delete"}	\N	\N
175	316	directus_permissions	45	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"share"}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","permissions":null,"validation":null,"fields":["*"],"presets":null,"collection":"directus_users","action":"share"}	\N	\N
176	318	directus_access	b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e	{"id":"b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e","role":null,"user":"ccd2cde6-bda7-46d3-8658-760a82e3f952","policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","sort":null}	{"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
177	417	directus_policies	47e6f0a5-e4fe-46e4-83ee-3cc55be3135a	{"id":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a","name":"PoliticaStaff","icon":"badge","description":"Politica de prueba con todos los permisos","ip_access":null,"enforce_tfa":false,"admin_access":false,"app_access":true,"permissions":[16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],"users":["2b313a97-8a94-4133-a3a3-c41d43cefa88","b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e"],"roles":["2b313a97-8a94-4133-a3a3-c41d43cefa88","b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e"]}	{"name":"PoliticaStaff"}	\N	\N
178	418	directus_permissions	22	{"id":22,"collection":"Project","action":"read","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	{"collection":"Project","action":"read","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
180	420	directus_permissions	32	{"id":32,"collection":"Task","action":"read","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	{"collection":"Task","action":"read","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
181	421	directus_permissions	33	{"id":33,"collection":"Task","action":"update","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	{"collection":"Task","action":"update","permissions":null,"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
182	429	directus_permissions	18	{"id":18,"collection":"Staff","action":"update","permissions":{"_and":[{"id":{"_eq":"$CURRENT_USER"}}]},"validation":null,"presets":null,"fields":["name","email","phone","password","register_date","type","resetToken","resetTokenExpiry","profileImage","clockifyUserId","id"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	{"collection":"Staff","action":"update","permissions":{"_and":[{"id":{"_eq":"$CURRENT_USER"}}]},"validation":null,"presets":null,"fields":["name","email","phone","password","register_date","type","resetToken","resetTokenExpiry","profileImage","clockifyUserId","id"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
183	430	directus_permissions	37	{"id":37,"collection":"Task_staff","action":"read","permissions":{"_and":[{"id":{"_eq":"$CURRENT_USER"}}]},"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	{"collection":"Task_staff","action":"read","permissions":{"_and":[{"id":{"_eq":"$CURRENT_USER"}}]},"validation":null,"presets":null,"fields":["*"],"policy":"47e6f0a5-e4fe-46e4-83ee-3cc55be3135a"}	\N	\N
184	439	directus_fields	45	{"sort":1,"interface":"input","special":null,"collection":"directus_users","field":"phone"}	{"sort":1,"interface":"input","special":null,"collection":"directus_users","field":"phone"}	\N	\N
185	440	directus_fields	46	{"sort":2,"interface":"datetime","special":null,"collection":"directus_users","field":"register_date"}	{"sort":2,"interface":"datetime","special":null,"collection":"directus_users","field":"register_date"}	\N	\N
186	441	directus_fields	46	{"id":46,"collection":"directus_users","field":"register_date","special":["date-created"],"interface":"datetime","options":null,"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":2,"width":"full","translations":null,"note":null,"conditions":null,"required":false,"group":null,"validation":null,"validation_message":null}	{"collection":"directus_users","field":"register_date","special":["date-created"]}	\N	\N
187	442	directus_fields	47	{"sort":3,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]},"collection":"directus_users","field":"type"}	{"sort":3,"interface":"select-dropdown","special":null,"options":{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]},"collection":"directus_users","field":"type"}	\N	\N
188	443	directus_fields	47	{"id":47,"collection":"directus_users","field":"type","special":null,"interface":"select-dropdown","options":{"choices":[{"text":"ADMIN","value":"admin"},{"text":"USER","value":"user"}]},"display":null,"display_options":null,"readonly":false,"hidden":false,"sort":3,"width":"full","translations":null,"note":null,"conditions":null,"required":true,"group":null,"validation":null,"validation_message":null}	{"collection":"directus_users","field":"type","required":true}	\N	\N
189	444	directus_fields	48	{"sort":4,"interface":"input","special":null,"collection":"directus_users","field":"resetToken"}	{"sort":4,"interface":"input","special":null,"collection":"directus_users","field":"resetToken"}	\N	\N
190	445	directus_fields	49	{"sort":5,"interface":"input","special":null,"collection":"directus_users","field":"resetTokenExpiry"}	{"sort":5,"interface":"input","special":null,"collection":"directus_users","field":"resetTokenExpiry"}	\N	\N
191	446	directus_fields	50	{"sort":6,"interface":"input","special":null,"collection":"directus_users","field":"profileImage"}	{"sort":6,"interface":"input","special":null,"collection":"directus_users","field":"profileImage"}	\N	\N
192	447	directus_fields	51	{"sort":7,"interface":"input","special":null,"collection":"directus_users","field":"clockifyUserId"}	{"sort":7,"interface":"input","special":null,"collection":"directus_users","field":"clockifyUserId"}	\N	\N
193	448	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952","first_name":"maite","last_name":null,"email":"maite@gmail.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","token":null,"last_access":"2025-05-09T07:12:03.421Z","last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474291","register_date":null,"type":"user","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e"]}	{"phone":"609474291"}	\N	\N
194	449	directus_users	7136fddd-4146-40f5-b506-25b77ededdf5	{"id":"7136fddd-4146-40f5-b506-25b77ededdf5","first_name":"ApiUser","last_name":null,"email":"apiuser@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":"2025-05-09T05:51:17.506Z","last_page":"/users/7136fddd-4146-40f5-b506-25b77ededdf5","provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474290","register_date":null,"type":"user","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["c1e7917b-f4d5-4ef9-baee-bff3f7c79398"]}	{"phone":"609474290"}	\N	\N
195	450	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	{"id":"3d59b549-1665-4368-8631-586f02ea12e5","first_name":"Admin","last_name":"Admin","email":"admin@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":"2025-05-09T08:14:04.770Z","last_page":"/users/3d59b549-1665-4368-8631-586f02ea12e5","provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474292","register_date":null,"type":"user","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["c504421c-a3f1-4106-8535-f9b07604141f"]}	{"phone":"609474292"}	\N	\N
196	451	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952","first_name":"maite","last_name":null,"email":"maite@gmail.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","token":null,"last_access":"2025-05-09T07:12:03.421Z","last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474291","register_date":null,"type":"admin","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e"]}	{"type":"admin"}	\N	\N
197	452	directus_users	ccd2cde6-bda7-46d3-8658-760a82e3f952	{"id":"ccd2cde6-bda7-46d3-8658-760a82e3f952","first_name":"maite","last_name":null,"email":"maite@gmail.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","token":null,"last_access":"2025-05-09T07:12:03.421Z","last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474291","register_date":null,"type":"user","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["b66e73f1-9eb2-43cc-b2fd-349e84ae3e3e"]}	{"type":"user"}	\N	\N
199	455	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	{"first_name":"Admin","email":"admin@gmail.com","password":"**********","role":"fd0935c8-df79-4771-84c9-c73875fdd763","policies":{"create":[{"user":"+","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"}}],"update":[],"delete":[]},"phone":"609474293","type":"admin"}	{"first_name":"Admin","email":"admin@gmail.com","password":"**********","role":"fd0935c8-df79-4771-84c9-c73875fdd763","policies":{"create":[{"user":"+","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"}}],"update":[],"delete":[]},"phone":"609474293","type":"admin"}	\N	\N
198	454	directus_access	120f41ed-a4fd-490d-97cf-6227795249d1	{"user":"aafe6467-b329-42b7-b91e-e7b70c118437","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"},"sort":1}	{"user":"aafe6467-b329-42b7-b91e-e7b70c118437","policy":{"id":"839e307f-de45-4dd6-9715-818dbc2103ef"},"sort":1}	199	\N
200	456	directus_users	3d59b549-1665-4368-8631-586f02ea12e5	{"id":"3d59b549-1665-4368-8631-586f02ea12e5","first_name":"nada","last_name":"nada","email":"admin@example.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":"2025-05-09T08:14:04.770Z","last_page":"/users/3d59b549-1665-4368-8631-586f02ea12e5","provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474292","register_date":null,"type":"user","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["c504421c-a3f1-4106-8535-f9b07604141f"]}	{"first_name":"nada","last_name":"nada"}	\N	\N
201	457	directus_users	aafe6467-b329-42b7-b91e-e7b70c118437	{"id":"aafe6467-b329-42b7-b91e-e7b70c118437","first_name":"Admin","last_name":"Admin","email":"admin@gmail.com","password":"**********","location":null,"title":null,"description":null,"tags":null,"avatar":null,"language":null,"tfa_secret":null,"status":"active","role":"fd0935c8-df79-4771-84c9-c73875fdd763","token":null,"last_access":null,"last_page":null,"provider":"default","external_identifier":null,"auth_data":null,"email_notifications":true,"appearance":null,"theme_dark":null,"theme_light":null,"theme_light_overrides":null,"theme_dark_overrides":null,"phone":"609474293","register_date":"2025-05-09","type":"admin","resetToken":null,"resetTokenExpiry":null,"profileImage":null,"clockifyUserId":null,"policies":["120f41ed-a4fd-490d-97cf-6227795249d1"]}	{"last_name":"Admin"}	\N	\N
202	458	directus_access	120f41ed-a4fd-490d-97cf-6227795249d1	{"id":"120f41ed-a4fd-490d-97cf-6227795249d1","role":null,"user":"aafe6467-b329-42b7-b91e-e7b70c118437","policy":"839e307f-de45-4dd6-9715-818dbc2103ef","sort":1}	{"policy":"839e307f-de45-4dd6-9715-818dbc2103ef"}	\N	\N
203	463	directus_users	44648516-c025-442d-b23f-7840246c4b6b	{"first_name":"Luisa","email":"luisa@gmail.com","password":"**********","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","status":"active","phone":"673883931","type":"user"}	{"first_name":"Luisa","email":"luisa@gmail.com","password":"**********","role":"4256f46d-8fe5-4a49-92b8-310645edb13f","status":"active","phone":"673883931","type":"user"}	\N	\N
204	479	directus_fields	52	{"sort":3,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{first_name}}"},"collection":"Task_staff","field":"staff"}	{"sort":3,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{first_name}}"},"collection":"Task_staff","field":"staff"}	\N	\N
205	480	directus_fields	53	{"sort":5,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"receiver"}	{"sort":5,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"receiver"}	\N	\N
206	481	directus_fields	54	{"sort":6,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"sender"}	{"sort":6,"interface":"select-dropdown-m2o","special":["m2o"],"options":{"template":"{{email}}"},"collection":"Messages","field":"sender"}	\N	\N
207	483	directus_users	f17613ee-ba32-4206-97ac-db75ab955e44	{"first_name":"Germán","email":"german@gmail.com","password":"**********","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"active","phone":"654421935","type":"admin"}	{"first_name":"Germán","email":"german@gmail.com","password":"**********","role":"fd0935c8-df79-4771-84c9-c73875fdd763","status":"active","phone":"654421935","type":"admin"}	\N	\N
\.


--
-- Data for Name: directus_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_roles (id, name, icon, description, parent) FROM stdin;
fd0935c8-df79-4771-84c9-c73875fdd763	Administrator	verified	$t:admin_description	\N
4256f46d-8fe5-4a49-92b8-310645edb13f	StaffRole	supervised_user_circle	Rol de usuario normal (prueba)	\N
\.


--
-- Data for Name: directus_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_sessions (token, "user", expires, ip, user_agent, share, origin, next_token) FROM stdin;
E0VSdeFcpn6lbduEUjApHvwGNLUGJrtCr9rbsk8cN4dNmqOELWqJEoTG2_iCT-7L	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:09.339+00	172.22.0.8	node	\N	\N	\N
RpmHzKOk3MrIh_2R3NQNk9N4yHCPlv9WRJbGhBpJ2zvuSOvJtUMSBFOg5fuBEKmR	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:09.773+00	172.22.0.8	node	\N	\N	\N
aUpIghnC-Zo0UZz9UOtbEo_vpcjLYpECO4rX1MGOWzXfO2CzEro5RhfqwLaEx1oV	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:09.934+00	172.22.0.8	node	\N	\N	\N
qMvZKwXhDu7zs43_hBsWL7G3j7gikXJPQvCsnjYgbofEZgLShqli6N_R_WQnMByy	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:10.089+00	172.22.0.8	node	\N	\N	\N
VBffxGabAH22ePvtpji7cxtEmAfman8gbSfsyK940UEgqonjaTyU4s2J5450WhnH	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:10.411+00	172.22.0.8	node	\N	\N	\N
9S_IHzlLGnNpPofXsroSlrQsr0W_HhG7-knT1OuvpoFVmHNdDsLUU2eFtFtyisgc	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:07:51.137+00	172.22.0.8	node	\N	\N	\N
eHMbDo7MmWRlSlO1DPkU3DHJMUVvlqHyIjKffIhQZFID9Zl21MtzBv5bJl8i2EJg	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:07.871+00	172.22.0.8	node	\N	\N	\N
Taqp7nVwVd0kEkqqY3YzqSseWF5BF9zyHNgkjg7w6b_nUk663tuIJ39arhPWtdFA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:10.561+00	172.22.0.8	node	\N	\N	\N
R2Zfo8wpcPhF6IY5rub5uIQ17iO7-kArN0y_aQlvWpVlUFcNEnl2q8KytiVAazf8	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:10.735+00	172.22.0.8	node	\N	\N	\N
LkSytJKylMMgzpBcbI57rYgkUiHwtGz0kmwxFHN8rZQ10WbPnIPTuL5X1ofN94nA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:10.895+00	172.22.0.8	node	\N	\N	\N
WWXXcSacBFd9fhHEnnTGf9XENoH6Y9y8NXNbautEUYHA0EnrCII8gBh0YwDzFNmN	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:11.056+00	172.22.0.8	node	\N	\N	\N
9zb9IZIM7v1cBKIsFdoLWzhPi0lyVAkwOj81Kf3vV48IwxFuSDhIo9TpZL2OGyOA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:11.198+00	172.22.0.8	node	\N	\N	\N
KtsJWKdXEWs-lntTYJmteiLTWBswnoEPQMvjZD9W00fmN7MIC58fxrMe1sWZQXEi	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:11.343+00	172.22.0.8	node	\N	\N	\N
oineGRmWqhaEUsiZda7qbLWVPLXtcamkKXuBzzVsb3bXlwcorqZQa60bv5ha52vv	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:11.526+00	172.22.0.8	node	\N	\N	\N
FhqobM9BIhNBKnt_EUfKMxXO3K_tFVGd2RaHw3Y-VXwCsUSNixMdnyr4GqqLpDPy	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:11.684+00	172.22.0.8	node	\N	\N	\N
aqVNVXu1tBZ19hub55ihSpFed_bNCQDHTDLGGePiMDE1ptnR4iRs1TPS92KelHYi	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:11.843+00	172.22.0.8	node	\N	\N	\N
tKZCHkbEwxnZcEzUhxRzkGchl9A7TFQk0cOMFCCuiHSgWYLk7W8L-MZ2O6V1__-R	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:10:54.858+00	172.22.0.1	PostmanRuntime/7.43.4	\N	\N	\N
GZkcfxD1tyqLk5kgyx2SFOrORCROiZNGCsKk_zrwms8EL065P0a1_i7_oac0ipmo	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:14:30.642+00	172.22.0.8	node	\N	\N	\N
epLI1WhnVXK_wNRd_AMDU8b5KeGdB306SFDWUswW5bPDF4PKAKH8oxA4EgCy3kbn	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:33.169+00	172.22.0.8	node	\N	\N	\N
_L_I-SRK-_LQzgStsk4NpQ0FVqB082KDml8bkiOyzmkZ3nUiW1BjAsUhftbodRvZ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:34.024+00	172.22.0.8	node	\N	\N	\N
yg-mv1cd2O9iEgpdtljqPsvsph0hiMu1w134V9210ikisO25BOTMpqx78ytb-F9O	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:34.258+00	172.22.0.8	node	\N	\N	\N
pauXC2uR1njLCx0rdZxYF8-tSe92oI98_f3Ql80ZIDWscgrtp4hiYpbDqhf4m7yd	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:34.407+00	172.22.0.8	node	\N	\N	\N
2E6L-gqFMqnL5B9pDNo2RkhNBIiy15gnYynnibVhP7qPH10hldu4Qwu8epVf2Q0p	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:34.589+00	172.22.0.8	node	\N	\N	\N
4jjw3c8cQ4tJPytgR0w8bjoxrT8ip7cofgfTIIa-FipFhHItSgzE7UzZjVgTec6a	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:34.745+00	172.22.0.8	node	\N	\N	\N
mP45OUJQt10V_eWGlzl8KxtJkchwukVXz4y5VXtBlH9XhWpP_C_31DoVjSoMLyyB	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:17:34.908+00	172.22.0.8	node	\N	\N	\N
nVQ7nLCwOgiSevhmdFuJZEeaCtdoihfP2wriQOWz4nzZ6s2UC7nGIYinUclrstVN	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:20:09.976+00	172.22.0.1	PostmanRuntime/7.43.4	\N	\N	\N
3_1oIrgZ2TSMKJAv8kjf-xp-ckaIpMRKJkkelYG19cB7B5-XeY5TbHHfTY1PvQJ8	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:21:54.539+00	172.22.0.8	node	\N	\N	\N
r3xoQhKE0U5iQN6sOFEd3H5QeZGjzaabohMwZpQQ0y428rC2v9snvVsDeCTrmfSk	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:21:54.726+00	172.22.0.8	node	\N	\N	\N
6ie5izmi7en7G2cJA9Hap0rUsg8hv2gLt3MhcCqnbGjzmWQ95UiuARgeqyOVgvNF	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:22:07.939+00	172.22.0.8	node	\N	\N	\N
EV7Eu33popr-S0aCvlBDdWXOlFyjgZbvsjjwy9kxLLOISj_xKFwtX3il-mBdkIF1	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:22:08.111+00	172.22.0.8	node	\N	\N	\N
IxDUdCrWd2pgDWXg3tX_P0dEsZIEkxV1_K49zTee1NE7qpKxkoUZ8UoXuktkOFiA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:28.109+00	172.22.0.8	node	\N	\N	\N
bqN576jqC3DlaMg73jVCSGnypJ1510JjkkCz76UfYhq1OU-1O1tY1toKe2199ubB	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:44.109+00	172.22.0.8	node	\N	\N	\N
_gdkCF2Ajh-9Bsf_MimPH6mcaL86deA5qF-wMCG-IkDVj3vcHpPqilf2oGQS-2SD	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:44.924+00	172.22.0.8	node	\N	\N	\N
e7_6w13d2bBFMeBJPmgNbuypSwfjx0jSgjPo0zb1NPnO_YxMANP3ztSZRRtx5MrO	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:45.121+00	172.22.0.8	node	\N	\N	\N
6o2ua1DpL2-Y_cruQtjbmxB1oIg_54JrDJbJ0Cj07xfJaai2GpfeRAcLtpLNCQvr	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:45.276+00	172.22.0.8	node	\N	\N	\N
gxsWKtFto0Fm1HvdkFbmAl0rN9TlyZjsRwrHREunx_GgAhfFJeCMErCrQI0rWTtG	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:45.439+00	172.22.0.8	node	\N	\N	\N
Q22HVo7uoYnxeij9YMV3nKiZEcZG3gULpK9zwYFeT-pf0Z4z29bmTHPo-ofh2cph	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:45.603+00	172.22.0.8	node	\N	\N	\N
33yFI0P7Q2Aj-TMW90-v4w05FzG4Do2Ks3y2Ur0Qs6kbvyaQZXg5_o97YYw6rp7w	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:45.756+00	172.22.0.8	node	\N	\N	\N
yD18A6OMu8h68sMzDkEk0NIC0Zbr9KBjE6OKRlyZ952uotcVQ184Wvw-OlyOWTE2	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:45.933+00	172.22.0.8	node	\N	\N	\N
mQnmMYkmVo2h5owCr8DdMBRF_O5VfluDtO4y6lRnBgcLUlNkfWonAPMoKNqWu9mm	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:25:52.095+00	172.22.0.1	PostmanRuntime/7.43.4	\N	\N	\N
EcbGTAc-TQJW9HOJOx-XCyeDR5hfhYmW1n0xC0rdEEgswS3b_fYnKqtajdWSCTJK	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:27:09.897+00	172.22.0.8	node	\N	\N	\N
JjGEdTDuGbW6B9_AEo2xQRZg4gCILJvzCXg-b4tyhuh5Q8fTNvOTXPbO-j0Aqtrz	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:29:22.153+00	172.22.0.8	node	\N	\N	\N
SzgbkFZtHeYDxXtAdCZLNrvF-yCOhLBdCBjxo0yOK3Rlh73TvtT6ipPIH-muyevG	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:32:46.743+00	172.22.0.8	node	\N	\N	\N
ad0dynCU-SUpc13dr0iXRw7UWXE9t5xkrzO0UR_x8swgSpxJWGJJwY7HpQyK-8Oy	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:38:56.711+00	172.22.0.8	node	\N	\N	\N
L1T5-qJ9GVG3HhKORmdLotk18iTnS2qtwhcE-Bp93ghUfBTjUPQTrnLDYw4ilba_	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:38:59.298+00	172.22.0.8	node	\N	\N	\N
tSMW6ACIq2-Ro2LaKmORYtqGLHTkw0DTp2IscQR06bigOw0EKP7JiJ_nx-Ln3mpA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:42:46.005+00	172.22.0.8	node	\N	\N	\N
iG-kNVdnyyq9FAkMoWfqgv0r1G9Ptg5TXXuFoRDZBmkntx8sZy2_TKsgVXmU3fJ2	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:47:47.049+00	172.22.0.8	node	\N	\N	\N
h7wBP7iANZmorVJ-kLfLqGrAuBI8AlQrjIXbpBUHKsFTq9x7GBxU484aj7Mw3AvX	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:47:47.753+00	172.22.0.8	node	\N	\N	\N
VFT3DnLLGgaYKtlQoaWOBhm6MiagbEtDIVHbWe8cLFoTXa1mAw8-E9ZKj4_nPHky	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:47:47.926+00	172.22.0.8	node	\N	\N	\N
Bos-becilidzZp6x4CtVur9S490JHku6uf-P_5rBi9A71WHuT216O5mpesjntpLG	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:47:48.097+00	172.22.0.8	node	\N	\N	\N
O0MqyhxG23rBDUt4gs3xUT7QP5RfvJKkSQkK5GiZ-TX52zBDPISIuboicdlIhA2W	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:47:48.258+00	172.22.0.8	node	\N	\N	\N
rCp2Aw4X2hRIuka5Gr2PpoeJTxvwJWLEvH293AKJNlklilbk0qjbs0Ycvprai8yg	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:47:48.42+00	172.22.0.8	node	\N	\N	\N
BIb0pkAnDB8SBLB808mOeO6zgiz0cs9Nou1hJMMbz9ghWit3YfMAN3UFPbiJOmbU	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:48:23.063+00	172.22.0.8	node	\N	\N	\N
747EG8ztd0twjSGPX4sLo6spKZ8X3bEoApAfIWR3GrRjJ4G0-MAaG1Zf0AhIuspz	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:48:24.186+00	172.22.0.8	node	\N	\N	\N
KxdLkO6arOPpk8FTXeptms30Awofipb0vsVRyZ-__s8h5A1S1_D7IqxBNiOefxRo	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:49:46.276+00	172.22.0.8	node	\N	\N	\N
I8q93hXnQPgWuoXPvsOkKt14rph3u6Hj2XDAe662b1Kx6gO-tKTaY7AXegno8c68	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:57:33.161+00	172.22.0.8	node	\N	\N	\N
Yn8yQL0MTy012po6WRggcaThr2atQbm9oqcazmde7KC7Y4g2w97S-CB-QrIPhjQC	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:58:38.391+00	172.22.0.8	node	\N	\N	\N
_za_7Oi-8MklRj9_znmQozWI-IkCUCvD8EQmNO3Hg0U03zmw8A6vbYB5bfIz-FWg	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 06:59:54.8+00	172.22.0.8	node	\N	\N	\N
gtINURtlPn_0440psm9WttwhXccM8HYWNC5d3iAV83_gNyxQjN-VZ30vNEOP-qnC	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:02:10.669+00	172.22.0.8	node	\N	\N	\N
X6OVX7RolJ2RldcOLUFiQzX0gus5DPBGjftf0PWsKwGeuAT61nY4FMtIgupHOvtv	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:08.457+00	172.22.0.8	node	\N	\N	\N
u_4UHHXBmn3CC8fMo5Q4RaH_qIueh3bSJVn1wtmJgjDO2QsF-8UCuT4iHeBfYjMr	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:21.844+00	172.22.0.8	node	\N	\N	\N
zs9hPjICzdwuy6WC7Q3bcp9ILDTRGnPcL1IFzidKQ3EPoQDmUV1V9PodM-wYE31G	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:22.701+00	172.22.0.8	node	\N	\N	\N
RencssADHvNKjgW_OMk5HuZ9dbF3qeeSX2zUn0COiYms3xTnet3668Z34Quy-xAH	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:22.892+00	172.22.0.8	node	\N	\N	\N
S0ZMzip8yxWskCVv7MJXiLWK385R022gkAFrn-lexY7vY87CG1K6ODcFo7zXf01v	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:23.049+00	172.22.0.8	node	\N	\N	\N
nVGDvCyE6fr6pkZ5l2b7nAwSaHixZntam6q4FNE9JL1RRCyhDHP0Z7dkrbZY-zv8	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:23.203+00	172.22.0.8	node	\N	\N	\N
PQtoQjUhbTWq3BHJwIrhxNsCJKYjzjQly82b1wWVULeSAauYS8_vBypGZGlscJvW	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:23.377+00	172.22.0.8	node	\N	\N	\N
z4cBUs3P0GoGbK4XxL817CkVj7x-WaAI3CqP3TSKfekiTzNUcdv7ka0x_vQeiq6Z	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:34.302+00	172.22.0.8	node	\N	\N	\N
cj8IK1qkvsZtwVJjrB2jBfSqWg6dH4W5gKgMfpCnRN5ggoFCezyVd7YZ7a_QokUr	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:35.395+00	172.22.0.8	node	\N	\N	\N
930DObBxKY2c7J1YaXrLFXHfInMAKycIKPQ-cZITly1nl3Uqj1A2TWn09-qS-lZN	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:35.571+00	172.22.0.8	node	\N	\N	\N
2m8CG4pLcztwBrSuhe9M4h2D_dGVk8vBhVOxLx0jJrqBibGT1c7VKAPvFwkqfSQe	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:35.729+00	172.22.0.8	node	\N	\N	\N
6XeQsb5PFhLF6NgIqJuGfVjkYVGy2GIifR7OPFEJ52vGzRLA-eVTid2l6AxMVo-6	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:35.902+00	172.22.0.8	node	\N	\N	\N
V1IJv8tDTT7UyTShDxGGsHvA_xjWLt82M_xQ_aRsIVg6IOgz_E1BrTadtEYAb1FX	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:36.042+00	172.22.0.8	node	\N	\N	\N
A8HJ2cPBe2bFhDiJkrZoBbTO-L0Qwnz9LgjfJniq5Rxvmm12ObYKGkNbkytQyUXm	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:36.21+00	172.22.0.8	node	\N	\N	\N
TyldPF3G5jTph0odstVGSOA3o0ilJareQUxu5WpS56eqSqJbwDuM7ySjN9-oYysX	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:36.342+00	172.22.0.8	node	\N	\N	\N
vj_e2WXy8mH9XzXUtfBMjCL5s_dQNjp4a22TIWuGsaKYqtUCkut6mDQJLRUu1YkV	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:57.952+00	172.22.0.8	node	\N	\N	\N
531Sqt1LjQ_9Sof_lnfCPRdgsQxIw4yUCq8VyEmpHn-MI6iMf78YxqO2yaAwtuQd	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:04:59.562+00	172.22.0.8	node	\N	\N	\N
uQd0aG7V5UsTf3OKdfiN-MmyXy8jjE8oFKKsYC4mD4XuluAMkU8CiEj6-23UVSbA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:05:25.259+00	172.22.0.8	node	\N	\N	\N
KoFlu_WKgHOFVS4a3d8xzClxYe5gnYKWSihri5SzrUzvHzZKqRi89JBAOxvYSz-8	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:43.441+00	172.22.0.8	node	\N	\N	\N
85OQZdNQlFJR0owhYDGLe3G8Z8uAZMb2mbHxHYAvA09XiETBWIHv8g56usq7eVty	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:45.338+00	172.22.0.8	node	\N	\N	\N
Q5nHDpTlGdPzK2iRYGdmR4MmrpZjo3P3RAAvsvXo43XJlLc0qlECvrXxYAJ2MH5_	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:51.979+00	172.22.0.8	node	\N	\N	\N
3TZb30CeSstNPUcYgbeFop-8v_d4hRxz2WAya0jbEU1KfiNJxlB_yzdieV_V_ShS	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:53.874+00	172.22.0.8	node	\N	\N	\N
0kchCmKEUWOr2ImVYJi6bug9KcOzbdmgi_wxiLFwq0L2F2ZczOV2_MzymSr2jaG0	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:54.054+00	172.22.0.8	node	\N	\N	\N
M9c1zk05_-Njyv-sT96k8DHc3LaOOK0bw0ftlM-0ouo2O68KHFPnZKwAr6A8wUwe	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:54.223+00	172.22.0.8	node	\N	\N	\N
xm6f9eu5XdVKUKMNzmR9d8ajyfGAPV696iq4YGuNGPFyq3lsaU7MQ3zjlEpH6le-	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:54.388+00	172.22.0.8	node	\N	\N	\N
CXhqRPNpuW5TFUb-JgEWlsS8Xa92ys9PuOoeOU21rDP4F5JFWWBHHHxh5z8DO3hQ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:54.801+00	172.22.0.8	node	\N	\N	\N
hq2EIPCQc-3wEeG-9fiur7cIpTRU5VSY9qmv8Zo0dX4vUuktQzLDrrTN6JHpo1Mp	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:54.974+00	172.22.0.8	node	\N	\N	\N
GZnuuXivjHRBdykqDLLmUDEvS0oz4AWRGKI3_PjVgUqlqzYtB3IQBIVu1AuZzIEW	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:55.141+00	172.22.0.8	node	\N	\N	\N
RZnYsAAXxkYWfddFvwWPL8SME6N73cSh7N-2r25qJUq4uQhKkqRp_pC4QVBOOXH-	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:55.319+00	172.22.0.8	node	\N	\N	\N
k97KTTdfV-YQBunezi60X4gTOQXwOI46UYgGP7ZhX4QEm3vnYFoN2vKDkQET2JHG	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:55.508+00	172.22.0.8	node	\N	\N	\N
sq-iWyWhc1vP9g8Vxeht_n5-tSbnZSW2DOoATDrAM4f-NY8_w1gm3MmHYYkX8IiA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:55.672+00	172.22.0.8	node	\N	\N	\N
ycIIjzov-CrDbbj4D4uds7_fR-iBCoaJ6UOHbDp4DgfK_43ZKYTk3_Sr7KpsGh0R	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:55.841+00	172.22.0.8	node	\N	\N	\N
ByS3lWXBfZreeha_X3Oyamf0TfogotA981F_26_kZ3rWmq0YtIrWdKSJwjaq-0bh	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:58.464+00	172.22.0.8	node	\N	\N	\N
DV6JJNloS0e-AKaonkGtUvPaFL2r8oKY9SmOWg04VfnNGVtgkVXAsTcBnDSEfDAl	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:58.624+00	172.22.0.8	node	\N	\N	\N
ESGaAxmVXpGOf61LrL816tsue1ss0VUa7b-8ZAOyr0I32qFhDrvQ6xc9aVu81SyS	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:58.79+00	172.22.0.8	node	\N	\N	\N
-Ge36QbFRHibAVScPtwL0RTHinj7IF1miG9yfyC0miaft_-aVR3xqpC-IC2_FwCY	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:58.958+00	172.22.0.8	node	\N	\N	\N
ly_WK1SnqksWQyW3smkl0JFtUdsftpVKlNEBQK-ulhsE_CqVAwV6whhe5DAN91uF	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:59.112+00	172.22.0.8	node	\N	\N	\N
Xp4_L1yY4d_5YGWwgbsVHl4Z_qpuNGB9ECsBIBbEPdZAsWJO1WMnh_0XVmOJ8uWZ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:59.276+00	172.22.0.8	node	\N	\N	\N
KkWcHmzpwoyx1VaQVf81N8nTLd9oiYCL2h4A8BNogmKaA2qD0bR4LLjt8LBpRcf1	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:59.424+00	172.22.0.8	node	\N	\N	\N
-nOZNTYi_YwqEg8T701t6w0L4tLM36VYGxcEQzWiywoFBzFSzP09Jy5D3jn3P-D5	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:59.589+00	172.22.0.8	node	\N	\N	\N
_pDws2XkVW-cuV9E_Sz1qcJW4JlbSTJI-KLhUv5YoDz69HOvHKdSMSI03u6ORJb_	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:59.757+00	172.22.0.8	node	\N	\N	\N
8mTJLOcR_nHe-HsA5wlbdNvz8QCbVFFaMff1XKsdOFctWBPW0u2OOq0xdGLEE--y	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:06:59.907+00	172.22.0.8	node	\N	\N	\N
o1ZJVOtDTWlRxWP0a6ZssXDFDbwIaMSaicNOmY8bDtLMtLxlX6CTLKcBH0dcv_8v	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:00.447+00	172.22.0.8	node	\N	\N	\N
82O_H524M6jqd18KHUovOQ7LcCM0DhWBuqeisHNOvgk7F9swtLx1cm9Fsskx2FYa	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:41.182+00	172.22.0.8	node	\N	\N	\N
uS2OvL4i84XarotBxSNAYVEHLgtZBBrbxx-wx3kG8VyY7wUDRqBgHKMwvlPtimcj	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:41.725+00	172.22.0.8	node	\N	\N	\N
O-z8BX--gKVsvh7ArqMSmZ03ddKO1VulrNOL4Iq5IZRmsAVndiAaanfL8uZXX15E	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:41.9+00	172.22.0.8	node	\N	\N	\N
O-2Al1N3aYpuLu2kV8cilDlHsLfJNG_SM8FOmE7kHMvU9cnfWR7aE9Ppl9WhgdGh	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:42.071+00	172.22.0.8	node	\N	\N	\N
TfdCY6ifrzbDgnXmdprWXhE1Wzlk1xq1wuhOseEPkWeSSB3sSHP8P7vbeu7x8xhF	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:44.112+00	172.22.0.8	node	\N	\N	\N
MD6fc0svZVMTarPKNkBKm47nr3JwJ6p63GuToq7U0zmz5INDIlmlUJaVhPFzTfqG	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:44.27+00	172.22.0.8	node	\N	\N	\N
amCUt1RpijuHb-sreDjZnFhWp3j5fbkE8N0dbmNb_wqcNgTCPnuyx6jKnJFxeHgp	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:44.429+00	172.22.0.8	node	\N	\N	\N
yP4ffBGWahw37Dfwe2FOtv5q6JtKwTjxMS5CqhA6tLn44zn08aOWZvAyaeY-C6bb	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:44.604+00	172.22.0.8	node	\N	\N	\N
FnxwR2Q5jEwwHUc1nZdKvN4LLwnBB0elOLFCFtzDF76HhUyp4D2Fu-cyWQoDl6RI	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:44.768+00	172.22.0.8	node	\N	\N	\N
95KGjhm5MX_45Wz2-uP90f92vHn1JD-pHLDBcEy98eh409PbXSHlfooc9D3z2FdS	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:44.942+00	172.22.0.8	node	\N	\N	\N
pfa0APgBduY0T7PHVzsOoYqvajNdQYnWfx7LRpW9i-soZDZ_UcRdwkmrw9RqEZ0p	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:45.117+00	172.22.0.8	node	\N	\N	\N
PQMXEND-mwIi0b49SKr1O_Oajuqcy6JsR3TtW4ZIHl-WUXGaioB9D8spWv_r9D-H	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:45.275+00	172.22.0.8	node	\N	\N	\N
1MajHn63PiCa0VFIwhvm--nHDZrEFrGnQUjWPsAIBcRBOS_mySc46lI4cZyqYZ5K	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:45.449+00	172.22.0.8	node	\N	\N	\N
6zKUBOdYwnhMmwIYwqgytY-84_7xIbUO07L0zU4Iw6aSZrgPUS_gyHDgFLhUYBQ1	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:45.638+00	172.22.0.8	node	\N	\N	\N
M6jgCqwyR8m55uY7q7LKdQHy8DGvq99f23RnRnVEocDC6GT1GGgltNYL5xnYhnvc	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:45.815+00	172.22.0.8	node	\N	\N	\N
cxCJRl4MUlVjQG_Y-FO1unR7EWzfKhm8Ff5soYF15KKAPYqJhZcZwZWMfSzXTPul	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:45.988+00	172.22.0.8	node	\N	\N	\N
6T-PwASkur5vSKETuuw_hSlvH9ydFp40ZX6FkO_zD9cwHkMC_T5UtPBKL6NcaSlX	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:46.175+00	172.22.0.8	node	\N	\N	\N
bb0xAXF42nWJPafHWNND-UYsj9RUhlV4hEoszbAyxZQwJ37gEnSgpll0Kgp6cn88	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:46.385+00	172.22.0.8	node	\N	\N	\N
dL_lXrI759w4jWtasdngR5e2XsNrlG2ErZVhBfjiOPUApf2qwj9GfHWceJdR2ikZ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:46.622+00	172.22.0.8	node	\N	\N	\N
dUuBOl9o5ii-ex-wL28rsGlzzVPrPD0KYUNyVLHcpBvxWKTzmaKaQFnWOLHIX-zP	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:46.832+00	172.22.0.8	node	\N	\N	\N
jwh5BMNS0-dklrGgJxEhoNXJHH8ty4PwJxprVz26ib7vNrDm652P5pOlh_RFiFZj	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:51.925+00	172.22.0.8	node	\N	\N	\N
Uq-Mwsuk7ZAsU8iZUPPu1o1NmaSQyLIICZoBVxXqsKFXFTCM33LhbkIJlkAn8bP5	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:52.314+00	172.22.0.8	node	\N	\N	\N
Oo1Xin30771X4ArRYID44CxRcUrJFGuzRdOqOfTwPK6pvjJUhASaXYz4l2akdokw	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:52.488+00	172.22.0.8	node	\N	\N	\N
0jx8__Mn5rrHHOc8pGeUC2ERm4U3uXPeHh_py5aqoql3SPtWz2Dk3Pf4f77QmzTh	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:52.666+00	172.22.0.8	node	\N	\N	\N
gLMRsUuf9WxA8BpKBDd1TAg7CGGrzfYXLukNYgQECot0aXXJtDN5PVV1UzlvaMgm	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:52.837+00	172.22.0.8	node	\N	\N	\N
CF-FjriImm1d8raXdNJVwN72zlelrMhbo0iQkW9ff8nWruYgeEpHj1zNIvz8r4_v	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:52.973+00	172.22.0.8	node	\N	\N	\N
NV0dz2DqIJ1gMCxjNB_oEhmjVXrxXIg7LhxyEO-oSwFQR9GRplI6wCckMQDb4iDJ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:53.412+00	172.22.0.8	node	\N	\N	\N
B0UByOz8ddDr1nI-8Z8r80OpTXAruyLo9WiArRMvj8N05XlI4zDryPfUHCHpfVQR	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:53.594+00	172.22.0.8	node	\N	\N	\N
lJV3AU-S6WxBBNDZc7lfmWyp2SC91aE9VbLdFZlKxThiXPvAOohVL8MA2b7uHuku	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:53.764+00	172.22.0.8	node	\N	\N	\N
IpFpBIQzxArN8VNBpYIuEVjRycgaigJDSkf_OrWjQdaTnJm42NVPpR90Gf9hxG-I	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:53.915+00	172.22.0.8	node	\N	\N	\N
ysjFuUmNcdrUYYeIC2kHzBis8EmcIKwyj0GJDs0bypnoLSg_IESAaXtR6ZIR-Jev	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:07:54.101+00	172.22.0.8	node	\N	\N	\N
a-NuCUBwzVJPowLWqG6t5HfxDgzVpalj0Ux0TeDTVLl-89HrOJ-xnhe90F1CJrg1	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:11:32.13+00	172.22.0.8	node	\N	\N	\N
xTs3Zr7o4IH2shWJvX7mWYRDYpZig868Khn1UjMkW1k57ef1dWJkJ7RTnVtuBUva	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:11:33.68+00	172.22.0.8	node	\N	\N	\N
dmYZtk8ZmeX4RHlJo1RvqYS0jNomlolYVs8iZCWeh3RD1w6h0h7CxXqp5G88OKHC	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 07:12:03.413+00	172.22.0.8	node	\N	\N	\N
MMfX76sUTnfGI4_iH-7mPBYFiRNHhVZ16-AnZS0Qx9oBOtSJbCjAkebNP-Gp8Jzy	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:02:30.599+00	172.22.0.8	node	\N	\N	\N
cnavWGSvwckOLLcyjwmJy6Q_jRqTRQwTHmZJMSz-pcBk7_O_9EGjkbsZEbevSQT8	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 08:55:27.319+00	172.22.0.8	node	\N	\N	\N
OsxIRe16eWtSEgnZcmS4Sq-np8wOsS87uj5ahP_NLCtkqxjySxDfH9C3xYaS1X7Q	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 08:55:31.743+00	172.22.0.8	node	\N	\N	\N
WSGu27mZdWPpoJQMQBThlICm9o-w41rEPHrwRQXscb61xDC3TRSso5qoRFNGplrp	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:09:14.01+00	172.22.0.8	node	\N	\N	\N
vY1hxyKw8NmGKly6j04cITBtYPumDvmvhIbFZgg-cUVyEYhFD0ietaE47BL_FaVC	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:11:14.588+00	172.22.0.8	node	\N	\N	\N
_zwAFoUyAUx48HFjBnBvh_zL8lJqzQ3sYKx_ywQIW5ri-erNQqjZzeEyZNCcn2Pi	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-16 09:48:47.578+00	172.22.0.8	node	\N	\N	\N
5o3SVI6TasQfRRtvsGQ7d6XsgYEKIo-_obf_xzc47c5ClNCvjDGRhYIRwMKSnNV5	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:12:40.859+00	172.22.0.8	node	\N	\N	\N
g6gIjkGS4bw2f1r0Zv2Xr6k2t6vNLBjc2TDz7c6lUiBNq186Ege6OtOH2xd90ySp	3d59b549-1665-4368-8631-586f02ea12e5	2025-05-10 09:48:52.701+00	172.22.0.1	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36	\N	http://localhost:8055	\N
_SJwEhD3Ukjpjhiq6K9am2-KVGj87Ssq5lpLWWq3MqGSeYXr4UfB0sw8tNG_EnAv	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-16 10:03:44.007+00	172.22.0.8	node	\N	\N	\N
wzAr9i5krLkWNU3H02xjkqZuZakdm0LeKUOOstNtaAvQND6SY-5AS__5D05i0zqX	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:32.699+00	172.22.0.8	node	\N	\N	\N
fceDufUw2lq-3qnrqSWtTAx6DaTVdz_zEexUyJjLsskWYrQp8bsPIfIHIQceR6tR	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:37.748+00	172.22.0.8	node	\N	\N	\N
OqZDSn9q3QamCQtvFTN0X-g1ADRwIaabuvZCQY84Z3EIK6mp51VHCYN1dNWkLGHJ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:38.564+00	172.22.0.8	node	\N	\N	\N
Eq6mVueb64Qe-9jzZWa6if7LpCa8mFr5-GociULLdh4QbNzbCWkwPIDXK356v-RP	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:38.772+00	172.22.0.8	node	\N	\N	\N
bFLun34Or-cLAIeeVyZoL8H8jRJLsXxB3wlgJiXBMXiZwIzSaIL5F8pMxunDdJ1J	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:39.18+00	172.22.0.8	node	\N	\N	\N
QD8YWpsj2IO1IMYhSR4unXGF3jbhx2O8YSW5dmkgFiKz7W9NyZO-yzpbDSJ7MSLp	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:39.424+00	172.22.0.8	node	\N	\N	\N
sKC2SF7P-t5WvkBk9eYJZ-FPovaacKL6pwtaDQfLlrIBPwNcV4xN8xRAvO4BUVcP	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:39.658+00	172.22.0.8	node	\N	\N	\N
MqwSW_91Bd3wXuZWvetif7-70Vp7yg7EKBaLWKlSCTDkasSxzSYUIyGTYAWHD1R_	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:39.97+00	172.22.0.8	node	\N	\N	\N
J9OzGc-ahNofiBNxA4Tfwuor3CCO6CM9ywcVZSIgzsfGp_axaLY4FjmpJxX-9nV9	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:40.194+00	172.22.0.8	node	\N	\N	\N
GFoJrR2pe7qOtDFuBI8oUfasu8HmfHcPc5RD1HdP-vqW-uKPcasCh2ievcHLGoRk	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:40.711+00	172.22.0.8	node	\N	\N	\N
BWqX8FGBs_77sADaNaVIyjuNFl_N-sL2SRbNh1g_XKMxZ9fkujoH_HvI--hMpMRE	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:40.891+00	172.22.0.8	node	\N	\N	\N
fb6j51mDRGM2SyQrrkrJ3jvGYYuRWUMis3_ugsHPO8i10OoyoQht4t6Wc6nnJCHE	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:41.049+00	172.22.0.8	node	\N	\N	\N
Rg5m1LIvdsasQ5YTsWiGw_d6mQrq-UoJlXhY7CQ-s1xvOFVvBoZfVGNCTPiKV2SO	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:41.221+00	172.22.0.8	node	\N	\N	\N
YuVm3NlBbVRnvGo9o1l94Nh1mhH2lQQmKLI47ox5H7FAXUrSp5UyfiFZ1LWUcTQK	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:41.397+00	172.22.0.8	node	\N	\N	\N
CXwIYbcnob6pz78ygVMvZPQRinEF0pPCyy6-2et87jOlqiUK40lzPvyrD01XoJx2	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:41.6+00	172.22.0.8	node	\N	\N	\N
6nkCFPcm8-_g0rSCEJ346cJUMlkUGA1se4eI_Ucjv5_zdPa9N5f4eyBLDRDXKSYQ	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:42.098+00	172.22.0.8	node	\N	\N	\N
2m-butXQho-oF5kQYAHlaA5QamkjSG-j-x4XBNKdkIpxrMSMLad2vhUFpPDwgime	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:42.311+00	172.22.0.8	node	\N	\N	\N
yrxsjEG9MK4syDPnIwxhGJ-s2-8ySovp1w_7vXwF6r6ceaYE0UZyjr9o5gJHnDlr	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:42.56+00	172.22.0.8	node	\N	\N	\N
PG1JY61rpFw8J_mdYRmXeaYTcW7xGmQKqlDJeJ2xjeKQHlSSwMyPBS0vzqnceh7k	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:52.107+00	172.22.0.8	node	\N	\N	\N
z5NQOZfex5Bi0qSFEX91kpmFkJFmaDlXdeq5H_O2MepsEph3zI03F8vwdz2s7X7j	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:52.661+00	172.22.0.8	node	\N	\N	\N
L-rGtlmMNSirJHQg_oJnrVhNJkoLDQdsu7bz9oQfBkOjy9n4Gb9F_6KG_qTOL1BA	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:56:55.776+00	172.22.0.8	node	\N	\N	\N
a7oKRm8MhCCWZEwlKUy7j_4GORBrkJ-XbCTBNyR1gObvXS8tRdD7vTh-0tEaVLAb	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-16 10:57:59.491+00	172.22.0.8	node	\N	\N	\N
5UNfNw-oroTTa4MWYjR8pWMpT-C94CBPGdZaqLqk5aWl2yCk_oYrQ_oGny0jp_Gt	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 10:59:30.404+00	172.22.0.8	node	\N	\N	\N
PBvNc-FY_BFUpme_BQJXW-Kyuptn8tooDj1fOOjkdoxLM-zcNwvvkN3GUP0xokpm	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:15:40.981+00	172.22.0.8	node	\N	\N	\N
pfEJB-Oho-7CO1GBjuOgEMrqC1Qd7g3fotnno5gruSglXlvgVTncuPIWMG_2veUM	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:18:02.381+00	172.22.0.8	node	\N	\N	\N
2VW3w-aGiRymfvaOUNUCE42jdl845TnbfPxwOA7z7fSYKzFxKHUxtRMFM9ozz1sG	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:19:57.952+00	172.22.0.8	node	\N	\N	\N
8q5ZqIm7jMnK4OnuxayLPwzic2OB96-C59hO6A0slMEQRio3qksqQHdZ8A-9GaFx	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:24:05.096+00	172.22.0.8	node	\N	\N	\N
1VE7b0BNc8Rg7Wy2_EuYctD1D4VyR1Dwe78nPQ7Rn3-HMqptUXwO6CEokovcU5I4	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:24:06.967+00	172.22.0.8	node	\N	\N	\N
L9Z0ObX29EMljgxVzIDpnySj38wWBIUviXQGaUdo_4I_mCT9i6eppwWzex9XzDba	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:24:07.354+00	172.22.0.8	node	\N	\N	\N
sDaC0CvNY6It7hQsMw2hlNJxW4SBkzvNisCeOxi7UjQWwLCcDpnxOrsrX3ju7Uk0	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:24:07.511+00	172.22.0.8	node	\N	\N	\N
Ua2QAigoJiveW5-OXD4xkey_ac5Gf5niLFwEt1Qth5JAvDI2Al5y49-_q2x1_YxF	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:24:27.793+00	172.22.0.8	node	\N	\N	\N
AQQ3SHhdb7CXZLR3RHMWtB1qmpEj8MqnSYuoIzcYPQGxaEOLadQrMVqY68OYYXAz	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:25:02.355+00	172.22.0.8	node	\N	\N	\N
wGv1b4e4-a6MpZNsNmRw9BT4cSYNYjHIktx82EZhEe5sFCbDjNAjk7D9gd2kNZCk	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:25:17.534+00	172.22.0.8	node	\N	\N	\N
vag7xAGPNHLqf0RLGeFif2zeGBIOz-N_llDC3gEYCEj80EtZmmeKyO1hVZynDhnl	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:25:44.367+00	172.22.0.8	node	\N	\N	\N
yymoFnu2GjQuC-NnPTh3z5QhtjE5eT9LHeJs8IXoBV25r8tf2yuqdhlK1jxtQu8_	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:31:18.919+00	172.22.0.8	node	\N	\N	\N
6NslTA65P3ImmOAS6cTe_D0c89oIIZEqN7ylRRAvflfB4ZoihxfMAiHScP5kfGrz	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:31:39.965+00	172.22.0.8	node	\N	\N	\N
32xWwTEHwuNRDL3h8wBFIp7ZRTs5bIyH1EHreP08STqI5dmn-kD2qo4MvlKZpQr5	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:34:04.281+00	172.22.0.8	node	\N	\N	\N
XEI5Uhi8AYKT-5RNvUL2q1nGhTFOmdFgl-gkI0hNdcNQjqDnJSYHC252zLoYNAWB	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:34:29.312+00	172.22.0.8	node	\N	\N	\N
OeiL-4C3WyKuap8CAWisHGD3NG2t8tyrzbs0IHDEP8ds_F_2Y1hmIoPvRrZSG9Bi	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:38:41.206+00	172.22.0.8	node	\N	\N	\N
XbKcZlJA_rqQSVr4c_h04caEBuXp80H4p6Jh1BZivlQexdjVLEok6aag7601hcsq	ccd2cde6-bda7-46d3-8658-760a82e3f952	2025-05-16 11:39:34.732+00	172.22.0.8	node	\N	\N	\N
qOi_YEYAOFWVM9IjrB-wxsJvv2kAkVYECzvOXEyR5bdxcIgnEPSVi4I6Hf4htkcA	aafe6467-b329-42b7-b91e-e7b70c118437	2025-05-16 11:42:15.19+00	172.22.0.8	node	\N	\N	\N
\.


--
-- Data for Name: directus_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_settings (id, project_name, project_url, project_color, project_logo, public_foreground, public_background, public_note, auth_login_attempts, auth_password_policy, storage_asset_transform, storage_asset_presets, custom_css, storage_default_folder, basemaps, mapbox_key, module_bar, project_descriptor, default_language, custom_aspect_ratios, public_favicon, default_appearance, default_theme_light, theme_light_overrides, default_theme_dark, theme_dark_overrides, report_error_url, report_bug_url, report_feature_url, public_registration, public_registration_verify_email, public_registration_role, public_registration_email_filter, visual_editor_urls) FROM stdin;
\.


--
-- Data for Name: directus_shares; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_shares (id, name, collection, item, role, password, user_created, date_created, date_start, date_end, times_used, max_uses) FROM stdin;
\.


--
-- Data for Name: directus_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_translations (id, language, key, value) FROM stdin;
\.


--
-- Data for Name: directus_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_users (id, first_name, last_name, email, password, location, title, description, tags, avatar, language, tfa_secret, status, role, token, last_access, last_page, provider, external_identifier, auth_data, email_notifications, appearance, theme_dark, theme_light, theme_light_overrides, theme_dark_overrides, phone, register_date, type, "resetToken", "resetTokenExpiry", "profileImage", "clockifyUserId") FROM stdin;
ccd2cde6-bda7-46d3-8658-760a82e3f952	maite	\N	maite@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$QcM2OHjLEn9YN9Tfj3g/hg$5HJlqaXnmgp8vjewr1PPma0OTfMNblU7cw5mGL3J9Jg	\N	\N	\N	\N	\N	\N	\N	active	4256f46d-8fe5-4a49-92b8-310645edb13f	\N	2025-05-09 11:39:34.741+00	\N	default	\N	\N	t	\N	\N	\N	\N	\N	609474291	\N	user	\N	\N	\N	\N
aafe6467-b329-42b7-b91e-e7b70c118437	Admin	Admin	admin@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ZIGdwXqJDR00t72ud3wMQA$Mwsj2ji/5PMbiPElU7+eH0Y/y82AKePQEfCqMMeMsjE	\N	\N	\N	\N	\N	\N	\N	active	fd0935c8-df79-4771-84c9-c73875fdd763	\N	2025-05-09 11:42:15.198+00	\N	default	\N	\N	t	\N	\N	\N	\N	\N	609474293	2025-05-09	admin	\N	\N	\N	\N
44648516-c025-442d-b23f-7840246c4b6b	Luisa	\N	luisa@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$97vu8Q3b0AZLtqlfNOeqrg$uuJ4nyplwPFhZ6bD5qTL+BKSIPRzPfQHeqMdFQPSWhI	\N	\N	\N	\N	\N	\N	\N	active	4256f46d-8fe5-4a49-92b8-310645edb13f	\N	\N	\N	default	\N	\N	t	\N	\N	\N	\N	\N	673883931	2025-05-09	user	\N	\N	\N	\N
f17613ee-ba32-4206-97ac-db75ab955e44	Germán	\N	german@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6lq8ZOSIkXhZdHs9UtXQHQ$7tO0L2Q1NcNGC8PzXCYwKO3enOInl+z/6h0nVAf4IwI	\N	\N	\N	\N	\N	\N	\N	active	fd0935c8-df79-4771-84c9-c73875fdd763	\N	\N	\N	default	\N	\N	t	\N	\N	\N	\N	\N	654421935	2025-05-09	admin	\N	\N	\N	\N
3d59b549-1665-4368-8631-586f02ea12e5	nada	nada	admin@example.com	$argon2id$v=19$m=65536,t=3,p=4$Y954JrEWfCyGH0TIkLGHiw$gsjXCTlne0GIfzaHB/4GDGr1rTop+W1yMcGnlbE8TTc	\N	\N	\N	\N	\N	\N	\N	active	fd0935c8-df79-4771-84c9-c73875fdd763	\N	2025-05-09 09:48:52.703+00	/users	default	\N	\N	t	\N	\N	\N	\N	\N	609474292	\N	user	\N	\N	\N	\N
\.


--
-- Data for Name: directus_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_versions (id, key, name, collection, item, hash, date_created, date_updated, user_created, user_updated, delta) FROM stdin;
\.


--
-- Data for Name: directus_webhooks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directus_webhooks (id, name, method, url, status, data, actions, collections, headers, was_active_before_deprecation, migrated_flow) FROM stdin;
\.


--
-- Name: directus_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_activity_id_seq', 528, true);


--
-- Name: directus_fields_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_fields_id_seq', 54, true);


--
-- Name: directus_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_notifications_id_seq', 1, false);


--
-- Name: directus_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_permissions_id_seq', 45, true);


--
-- Name: directus_presets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_presets_id_seq', 4, true);


--
-- Name: directus_relations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_relations_id_seq', 8, true);


--
-- Name: directus_revisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_revisions_id_seq', 207, true);


--
-- Name: directus_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_settings_id_seq', 1, false);


--
-- Name: directus_webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directus_webhooks_id_seq', 1, false);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: Task_staff Task_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task_staff"
    ADD CONSTRAINT "Task_staff_pkey" PRIMARY KEY (id);


--
-- Name: directus_access directus_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_pkey PRIMARY KEY (id);


--
-- Name: directus_activity directus_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_activity
    ADD CONSTRAINT directus_activity_pkey PRIMARY KEY (id);


--
-- Name: directus_collections directus_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_collections
    ADD CONSTRAINT directus_collections_pkey PRIMARY KEY (collection);


--
-- Name: directus_comments directus_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_comments
    ADD CONSTRAINT directus_comments_pkey PRIMARY KEY (id);


--
-- Name: directus_dashboards directus_dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_dashboards
    ADD CONSTRAINT directus_dashboards_pkey PRIMARY KEY (id);


--
-- Name: directus_extensions directus_extensions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_extensions
    ADD CONSTRAINT directus_extensions_pkey PRIMARY KEY (id);


--
-- Name: directus_fields directus_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_fields
    ADD CONSTRAINT directus_fields_pkey PRIMARY KEY (id);


--
-- Name: directus_files directus_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_pkey PRIMARY KEY (id);


--
-- Name: directus_flows directus_flows_operation_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_flows
    ADD CONSTRAINT directus_flows_operation_unique UNIQUE (operation);


--
-- Name: directus_flows directus_flows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_flows
    ADD CONSTRAINT directus_flows_pkey PRIMARY KEY (id);


--
-- Name: directus_folders directus_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_folders
    ADD CONSTRAINT directus_folders_pkey PRIMARY KEY (id);


--
-- Name: directus_migrations directus_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_migrations
    ADD CONSTRAINT directus_migrations_pkey PRIMARY KEY (version);


--
-- Name: directus_notifications directus_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_notifications
    ADD CONSTRAINT directus_notifications_pkey PRIMARY KEY (id);


--
-- Name: directus_operations directus_operations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_pkey PRIMARY KEY (id);


--
-- Name: directus_operations directus_operations_reject_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_reject_unique UNIQUE (reject);


--
-- Name: directus_operations directus_operations_resolve_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_resolve_unique UNIQUE (resolve);


--
-- Name: directus_panels directus_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_panels
    ADD CONSTRAINT directus_panels_pkey PRIMARY KEY (id);


--
-- Name: directus_permissions directus_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_permissions
    ADD CONSTRAINT directus_permissions_pkey PRIMARY KEY (id);


--
-- Name: directus_policies directus_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_policies
    ADD CONSTRAINT directus_policies_pkey PRIMARY KEY (id);


--
-- Name: directus_presets directus_presets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_presets
    ADD CONSTRAINT directus_presets_pkey PRIMARY KEY (id);


--
-- Name: directus_relations directus_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_relations
    ADD CONSTRAINT directus_relations_pkey PRIMARY KEY (id);


--
-- Name: directus_revisions directus_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_revisions
    ADD CONSTRAINT directus_revisions_pkey PRIMARY KEY (id);


--
-- Name: directus_roles directus_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_roles
    ADD CONSTRAINT directus_roles_pkey PRIMARY KEY (id);


--
-- Name: directus_sessions directus_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_sessions
    ADD CONSTRAINT directus_sessions_pkey PRIMARY KEY (token);


--
-- Name: directus_settings directus_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_pkey PRIMARY KEY (id);


--
-- Name: directus_shares directus_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_pkey PRIMARY KEY (id);


--
-- Name: directus_translations directus_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_translations
    ADD CONSTRAINT directus_translations_pkey PRIMARY KEY (id);


--
-- Name: directus_users directus_users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_email_unique UNIQUE (email);


--
-- Name: directus_users directus_users_external_identifier_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_external_identifier_unique UNIQUE (external_identifier);


--
-- Name: directus_users directus_users_phone_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_phone_unique UNIQUE (phone);


--
-- Name: directus_users directus_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_pkey PRIMARY KEY (id);


--
-- Name: directus_users directus_users_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_token_unique UNIQUE (token);


--
-- Name: directus_versions directus_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_pkey PRIMARY KEY (id);


--
-- Name: directus_webhooks directus_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_webhooks
    ADD CONSTRAINT directus_webhooks_pkey PRIMARY KEY (id);


--
-- Name: Project project_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT project_title_unique UNIQUE (title);


--
-- Name: directus_access directus_access_policy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_policy_foreign FOREIGN KEY (policy) REFERENCES public.directus_policies(id) ON DELETE CASCADE;


--
-- Name: directus_access directus_access_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE;


--
-- Name: directus_access directus_access_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_access
    ADD CONSTRAINT directus_access_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_collections directus_collections_group_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_collections
    ADD CONSTRAINT directus_collections_group_foreign FOREIGN KEY ("group") REFERENCES public.directus_collections(collection);


--
-- Name: directus_comments directus_comments_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_comments
    ADD CONSTRAINT directus_comments_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_comments directus_comments_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_comments
    ADD CONSTRAINT directus_comments_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: directus_dashboards directus_dashboards_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_dashboards
    ADD CONSTRAINT directus_dashboards_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_files directus_files_folder_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_folder_foreign FOREIGN KEY (folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL;


--
-- Name: directus_files directus_files_modified_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_modified_by_foreign FOREIGN KEY (modified_by) REFERENCES public.directus_users(id);


--
-- Name: directus_files directus_files_uploaded_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_files
    ADD CONSTRAINT directus_files_uploaded_by_foreign FOREIGN KEY (uploaded_by) REFERENCES public.directus_users(id);


--
-- Name: directus_flows directus_flows_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_flows
    ADD CONSTRAINT directus_flows_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_folders directus_folders_parent_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_folders
    ADD CONSTRAINT directus_folders_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_folders(id);


--
-- Name: directus_notifications directus_notifications_recipient_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_notifications
    ADD CONSTRAINT directus_notifications_recipient_foreign FOREIGN KEY (recipient) REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_notifications directus_notifications_sender_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_notifications
    ADD CONSTRAINT directus_notifications_sender_foreign FOREIGN KEY (sender) REFERENCES public.directus_users(id);


--
-- Name: directus_operations directus_operations_flow_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_flow_foreign FOREIGN KEY (flow) REFERENCES public.directus_flows(id) ON DELETE CASCADE;


--
-- Name: directus_operations directus_operations_reject_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_reject_foreign FOREIGN KEY (reject) REFERENCES public.directus_operations(id);


--
-- Name: directus_operations directus_operations_resolve_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_resolve_foreign FOREIGN KEY (resolve) REFERENCES public.directus_operations(id);


--
-- Name: directus_operations directus_operations_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_operations
    ADD CONSTRAINT directus_operations_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_panels directus_panels_dashboard_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_panels
    ADD CONSTRAINT directus_panels_dashboard_foreign FOREIGN KEY (dashboard) REFERENCES public.directus_dashboards(id) ON DELETE CASCADE;


--
-- Name: directus_panels directus_panels_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_panels
    ADD CONSTRAINT directus_panels_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_permissions directus_permissions_policy_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_permissions
    ADD CONSTRAINT directus_permissions_policy_foreign FOREIGN KEY (policy) REFERENCES public.directus_policies(id) ON DELETE CASCADE;


--
-- Name: directus_presets directus_presets_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_presets
    ADD CONSTRAINT directus_presets_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE;


--
-- Name: directus_presets directus_presets_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_presets
    ADD CONSTRAINT directus_presets_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_revisions directus_revisions_activity_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_revisions
    ADD CONSTRAINT directus_revisions_activity_foreign FOREIGN KEY (activity) REFERENCES public.directus_activity(id) ON DELETE CASCADE;


--
-- Name: directus_revisions directus_revisions_parent_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_revisions
    ADD CONSTRAINT directus_revisions_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_revisions(id);


--
-- Name: directus_revisions directus_revisions_version_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_revisions
    ADD CONSTRAINT directus_revisions_version_foreign FOREIGN KEY (version) REFERENCES public.directus_versions(id) ON DELETE CASCADE;


--
-- Name: directus_roles directus_roles_parent_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_roles
    ADD CONSTRAINT directus_roles_parent_foreign FOREIGN KEY (parent) REFERENCES public.directus_roles(id);


--
-- Name: directus_sessions directus_sessions_share_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_sessions
    ADD CONSTRAINT directus_sessions_share_foreign FOREIGN KEY (share) REFERENCES public.directus_shares(id) ON DELETE CASCADE;


--
-- Name: directus_sessions directus_sessions_user_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_sessions
    ADD CONSTRAINT directus_sessions_user_foreign FOREIGN KEY ("user") REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: directus_settings directus_settings_project_logo_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_project_logo_foreign FOREIGN KEY (project_logo) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_background_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_background_foreign FOREIGN KEY (public_background) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_favicon_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_favicon_foreign FOREIGN KEY (public_favicon) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_foreground_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_foreground_foreign FOREIGN KEY (public_foreground) REFERENCES public.directus_files(id);


--
-- Name: directus_settings directus_settings_public_registration_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_public_registration_role_foreign FOREIGN KEY (public_registration_role) REFERENCES public.directus_roles(id) ON DELETE SET NULL;


--
-- Name: directus_settings directus_settings_storage_default_folder_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_settings
    ADD CONSTRAINT directus_settings_storage_default_folder_foreign FOREIGN KEY (storage_default_folder) REFERENCES public.directus_folders(id) ON DELETE SET NULL;


--
-- Name: directus_shares directus_shares_collection_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_collection_foreign FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE;


--
-- Name: directus_shares directus_shares_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE CASCADE;


--
-- Name: directus_shares directus_shares_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_shares
    ADD CONSTRAINT directus_shares_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_users directus_users_role_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_users
    ADD CONSTRAINT directus_users_role_foreign FOREIGN KEY (role) REFERENCES public.directus_roles(id) ON DELETE SET NULL;


--
-- Name: directus_versions directus_versions_collection_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_collection_foreign FOREIGN KEY (collection) REFERENCES public.directus_collections(collection) ON DELETE CASCADE;


--
-- Name: directus_versions directus_versions_user_created_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_user_created_foreign FOREIGN KEY (user_created) REFERENCES public.directus_users(id) ON DELETE SET NULL;


--
-- Name: directus_versions directus_versions_user_updated_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_versions
    ADD CONSTRAINT directus_versions_user_updated_foreign FOREIGN KEY (user_updated) REFERENCES public.directus_users(id);


--
-- Name: directus_webhooks directus_webhooks_migrated_flow_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directus_webhooks
    ADD CONSTRAINT directus_webhooks_migrated_flow_foreign FOREIGN KEY (migrated_flow) REFERENCES public.directus_flows(id) ON DELETE SET NULL;


--
-- Name: Messages messages_receiver_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT messages_receiver_foreign FOREIGN KEY (receiver) REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: Messages messages_sender_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT messages_sender_foreign FOREIGN KEY (sender) REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: Task task_associated_project_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT task_associated_project_foreign FOREIGN KEY (associated_project) REFERENCES public."Project"(id) ON DELETE CASCADE;


--
-- Name: Task_staff task_staff_staff_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task_staff"
    ADD CONSTRAINT task_staff_staff_foreign FOREIGN KEY (staff) REFERENCES public.directus_users(id) ON DELETE CASCADE;


--
-- Name: Task_staff task_staff_task_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task_staff"
    ADD CONSTRAINT task_staff_task_foreign FOREIGN KEY (task) REFERENCES public."Task"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

