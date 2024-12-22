CREATE TABLE
    EMPLOYEE (
        E_ID SERIAL PRIMARY KEY,
        F_NAME VARCHAR(50),
        L_NAME VARCHAR(50),
        Birth_Date DATE,
        SALARY INT,
        E_ROLE VARCHAR(50),
        E_PHOTO VARCHAR(100),
        E_ADDRESS VARCHAR(100),
        E_EMAIL VARCHAR(100),
        E_PHONE VARCHAR(50),
        E_CITY VARCHAR(50),
        E_COUNTRY VARCHAR(50),
        E_ZIPCODE VARCHAR(50),
        E_USERNAME VARCHAR(50) UNIQUE,
        E_PASSWORD VARCHAR(255),
        E_GENDER VARCHAR(50),
        E_ACTIVE BOOLEAN DEFAULT False
    );
CREATE TABLE ACCESS_Actions (
    E_ID INT,
    users_page BOOLEAN DEFAULT False,
    users_add BOOLEAN DEFAULT False,
    users_edit BOOLEAN DEFAULT False,
    users_delete BOOLEAN DEFAULT False,
    users_view BOOLEAN DEFAULT False,

    products_page BOOLEAN DEFAULT False,
    products_add BOOLEAN DEFAULT False,
    products_edit BOOLEAN DEFAULT False,
    products_delete BOOLEAN DEFAULT False,
    products_view BOOLEAN DEFAULT False,

    repaire_page BOOLEAN DEFAULT False,
    repaire_add BOOLEAN DEFAULT False,
    repaire_edit BOOLEAN DEFAULT False,
    repaire_delete BOOLEAN DEFAULT False,
    repaire_view BOOLEAN DEFAULT False,
    repaire_adddum BOOLEAN DEFAULT False,

    sales_page BOOLEAN DEFAULT False,
    sales_add BOOLEAN DEFAULT False,
    sales_edit BOOLEAN DEFAULT False,
    sales_delete BOOLEAN DEFAULT False,
    sales_view BOOLEAN DEFAULT False,

    price_page BOOLEAN DEFAULT False,
    price_add BOOLEAN DEFAULT False,
    price_edit BOOLEAN DEFAULT False,
    price_delete BOOLEAN DEFAULT False,
    price_view BOOLEAN DEFAULT False,

    debts_page BOOLEAN DEFAULT False,
    debts_add BOOLEAN DEFAULT False,
    debts_edit BOOLEAN DEFAULT False,
    debts_delete BOOLEAN DEFAULT False,
    debts_view BOOLEAN DEFAULT False,

    purchase_page BOOLEAN DEFAULT False,
    purchase_add BOOLEAN DEFAULT False,
    purchase_edit BOOLEAN DEFAULT False,
    purchase_delete BOOLEAN DEFAULT False,
    purchase_view BOOLEAN DEFAULT False,

    customer_page BOOLEAN DEFAULT False,
    customer_add BOOLEAN DEFAULT False,
    customer_edit BOOLEAN DEFAULT False,
    customer_delete BOOLEAN DEFAULT False,
    customer_view BOOLEAN DEFAULT False,

    supplier_page BOOLEAN DEFAULT False,
    supplier_add BOOLEAN DEFAULT False,
    supplier_edit BOOLEAN DEFAULT False,
    supplier_delete BOOLEAN DEFAULT False,
    supplier_view BOOLEAN DEFAULT False,

    FOREIGN KEY (E_ID) REFERENCES EMPLOYEE (E_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (E_ID)
);

CREATE TABLE
    CUSTOMER (
        C_ID SERIAL PRIMARY KEY,
        C_NAME VARCHAR(50),
        C_ADDRESS VARCHAR(100),
        C_CITY VARCHAR(50),
        C_COUNTRY VARCHAR(50),
        C_ZIPCODE VARCHAR(50),
        C_FAX VARCHAR(50),
        C_PHONE VARCHAR(50),
        C_EMAIL VARCHAR(100),
        C_PHOTO VARCHAR(100)
    );

CREATE TABLE
    SUPPLIER (
        S_ID SERIAL PRIMARY KEY,
        S_NAME VARCHAR(50),
        S_ADDRESS VARCHAR(100),
        S_CITY VARCHAR(50),
        S_COUNTRY VARCHAR(50),
        S_ZIPCODE VARCHAR(50),
        S_FAX VARCHAR(50),
        S_PHONE VARCHAR(50),
        S_EMAIL VARCHAR(50),
        S_PHOTO VARCHAR(100)
    );

CREATE TABLE
    STOCK (
        P_ID SERIAL PRIMARY KEY,
        P_NAME VARCHAR(50),
        P_COSTPRICE FLOAT,
        P_SELLPRICE FLOAT,
        P_QUANTITY INT,
        P_PHOTO VARCHAR(100),
        P_DESCRIPTION TEXT,
        P_CATEGORY VARCHAR(50),
        MODEL_CODE VARCHAR(50),
        EXPIRE_DATE DATE,
        P_STATUS VARCHAR(50),
        SERIAL_NUMBER VARCHAR(50) UNIQUE
    );

CREATE TABLE
    SALES (
        SL_ID SERIAL PRIMARY KEY,
        SL_DATE DATE,
        SL_TOTAL FLOAT,
        SL_DISCOUNT FLOAT,
        SL_TAX FLOAT,
        SL_STATUS VARCHAR(50),
        SL_TYPE VARCHAR(50),
        SL_INAMOUNT FLOAT,
        SL_COST FLOAT,
        SL_BILLNUM INT UNIQUE,
        SL_PAYED FLOAT,
        SL_CURRENCY VARCHAR(50),
        C_ID INT,
        FOREIGN KEY (C_ID) REFERENCES CUSTOMER (C_ID) ON DELETE SET NULL ON UPDATE CASCADE
    );

CREATE TABLE
    PURCHASE (
        PCH_ID SERIAL PRIMARY KEY,
        PCH_DATE DATE,
        PCH_TOTAL FLOAT,
        PCH_TAX INT,
        PCH_COST INT,
        PCH_BILLNUM INT UNIQUE,
        PCH_CURRENCY VARCHAR(50),
        PCH_EXPENSE INT,
        PCH_CUSTOMSCOST INT,
        PCH_CUSTOMSNUM INT,
        S_ID INT,
        FOREIGN KEY (S_ID) REFERENCES SUPPLIER (S_ID) ON DELETE SET NULL ON UPDATE CASCADE
    );

CREATE TABLE
    DEBTS (
        D_ID SERIAL PRIMARY KEY,
        D_DATE DATE,
        D_TYPE VARCHAR(50),
        D_AMOUNT FLOAT,
        D_CURRENCY VARCHAR(50),
        SL_ID INT,
        FOREIGN KEY (SL_ID) REFERENCES SALES (SL_ID) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    SELL_ITEMS (
        P_ID INT,
        SL_ID INT,
        SI_QUANTITY INT,
        SI_TOTAL FLOAT,
        FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (SL_ID) REFERENCES SALES (SL_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (P_ID, SL_ID)
    );

CREATE TABLE
    ADDDUM (
        P_ID INT,
        SL_ID INT,
        FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (SL_ID) REFERENCES SALES (SL_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (P_ID, SL_ID)
    );

CREATE TABLE
    PURCHASE_ITEMS (
        P_ID INT,
        PCH_ID INT,
        PI_QUANTITY INT,
        P_COSTPRICE FLOAT,
        P_CATEGORY VARCHAR(50),
        PI_TOTAL FLOAT,
        FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (PCH_ID) REFERENCES PURCHASE (PCH_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (P_ID, PCH_ID)
    );

CREATE TABLE
    MARKETING (
        M_ID SERIAL PRIMARY KEY,
        M_DATE DATE,
        E_ID INT,
        C_ID INT,
        FOREIGN KEY (E_ID) REFERENCES EMPLOYEE (E_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (C_ID) REFERENCES CUSTOMER (C_ID) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    REPORT (
        RPT_ID SERIAL PRIMARY KEY,
        RP_TYPE VARCHAR(50) 
    );

CREATE TABLE
    PREPARE_REPORT (
        RPT_ID INT,
        E_ID INT,
        C_ID INT,
        P_ID INT,
        FOREIGN KEY (E_ID) REFERENCES EMPLOYEE (E_ID) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (C_ID) REFERENCES CUSTOMER (C_ID) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (RPT_ID) REFERENCES REPORT (RPT_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (RPT_ID, P_ID)
    );

CREATE TABLE
    REPAIR (
        REP_ID SERIAL PRIMARY KEY,
        P_ID INT,
         REMARKS TEXT,
        REP_DATE DATE,
         FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE SET NULL ON UPDATE CASCADE
    );

CREATE TABLE
    REPAIR_PROCESS (
        REP_ID INT,
        SP_ID INT,
        SP_QUANTITY INT,
        FOREIGN KEY (REP_ID) REFERENCES REPAIR (REP_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (SP_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (REP_ID, SP_ID)
    );

CREATE TABLE
    PRICE_QUOTATION (
        PQ_ID SERIAL PRIMARY KEY,
        PQ_DISCOUNT INT,
        PQ_CURRENCY VARCHAR(50),
        PQ_DURATION VARCHAR(50),
        PQ_TOTAL FLOAT
    );

CREATE TABLE
    OFFER (
        PQ_ID INT,
        P_ID INT,
        C_ID INT,
        FOREIGN KEY (PQ_ID) REFERENCES PRICE_QUOTATION (PQ_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (C_ID) REFERENCES CUSTOMER (C_ID) ON DELETE SET NULL ON UPDATE CASCADE,
        PRIMARY KEY (PQ_ID, P_ID)
    );

CREATE TABLE
    NOTIFICATION (
        N_ID SERIAL PRIMARY KEY,
        N_DATE DATE,
        N_TYPE VARCHAR(50),
        N_MESSAGE TEXT,
        N_STATUS VARCHAR(50),
        E_ID INT DEFAULT NULL,
        P_ID INT DEFAULT NULL,
        D_ID INT DEFAULT NULL,
        FOREIGN KEY (E_ID) REFERENCES EMPLOYEE (E_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (P_ID) REFERENCES STOCK (P_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (D_ID) REFERENCES DEBTS (D_ID) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    NOTIFICATION_EMPLOYEE (
        N_ID INT,
        E_ID INT,
        FOREIGN KEY (N_ID) REFERENCES NOTIFICATION (N_ID) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (E_ID) REFERENCES EMPLOYEE (E_ID) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (N_ID, E_ID)
    );
    

CREATE OR REPLACE FUNCTION notify_expiring_products() RETURNS TRIGGER AS $$
DECLARE
    manager_secretary_ids INT[];
    emp_id INT;
    notification_id INT;
BEGIN
    INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS, P_ID)
    VALUES (
        CURRENT_DATE,
        'Product Expiry',
        'Product ' || NEW.P_NAME || ' is nearing expiry!',
        'Pending',
        NEW.P_ID
    )
    RETURNING N_ID INTO notification_id;

    SELECT ARRAY_AGG(E_ID) INTO manager_secretary_ids
    FROM EMPLOYEE
    WHERE E_ROLE IN ('Manager', 'Secretary');

    FOREACH emp_id IN ARRAY manager_secretary_ids LOOP
        INSERT INTO NOTIFICATION_EMPLOYEE (N_ID, E_ID)
        VALUES (notification_id, emp_id);
    END LOOP;

    RETURN NEW;
END;
 $$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION notify_due_debts() RETURNS TRIGGER AS $$
DECLARE
    manager_accountant_ids INT[];
    emp_id INT;
    notification_id INT;
BEGIN
    INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS, D_ID)
    VALUES (
        CURRENT_DATE,
        'Debt Due Date',
        'Debt with ID ' || NEW.D_ID || ' is nearing its due date!',
        'Pending',
        NEW.D_ID
    )
    RETURNING N_ID INTO notification_id;

    SELECT ARRAY_AGG(E_ID) INTO manager_accountant_ids
    FROM EMPLOYEE
    WHERE E_ROLE IN ('Manager', 'Accountant');

    FOREACH emp_id IN ARRAY manager_accountant_ids LOOP
        INSERT INTO NOTIFICATION_EMPLOYEE (N_ID, E_ID)
        VALUES (notification_id, emp_id);
    END LOOP;

    RETURN NEW;
END;
 $$ LANGUAGE plpgsql;


CREATE TRIGGER debt_due_notification AFTER
INSERT
OR
UPDATE ON DEBTS
FOR EACH ROW WHEN (NEW.D_DATE IS NOT NULL
                   AND NEW.D_DATE <= CURRENT_DATE + INTERVAL '7 days') EXECUTE FUNCTION notify_due_debts();


CREATE TRIGGER product_expiry_notification AFTER
INSERT
OR
UPDATE ON STOCK
FOR EACH ROW WHEN (NEW.EXPIRE_DATE IS NOT NULL
                   AND NEW.EXPIRE_DATE <= CURRENT_DATE + INTERVAL '7 days') EXECUTE FUNCTION notify_expiring_products();


CREATE OR REPLACE FUNCTION notify_device_under_maintenance() RETURNS TRIGGER AS $$
DECLARE
    manager_technical_ids INT[];
    emp_id INT;
    notification_id INT;
BEGIN
    IF NEW.P_CATEGORY = 'Device Under Maintenance' THEN
        INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS, P_ID)
        VALUES (
            CURRENT_DATE,
            'Device Maintenance Required',
            'A new device, "' || NEW.P_NAME || '", has been added for maintenance. Immediate attention is needed to address its issues.',
            'Pending',
            NEW.P_ID
        )
        RETURNING N_ID INTO notification_id;

        SELECT ARRAY_AGG(E_ID) INTO manager_technical_ids
        FROM EMPLOYEE
        WHERE E_ROLE IN ('Manager', 'Technical Support');

        FOREACH emp_id IN ARRAY manager_technical_ids LOOP
            INSERT INTO NOTIFICATION_EMPLOYEE (N_ID, E_ID)
            VALUES (notification_id, emp_id);
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER device_under_maintenance_notification
AFTER INSERT ON STOCK
FOR EACH ROW
WHEN (NEW.P_CATEGORY = 'Device Under Maintenance')
EXECUTE FUNCTION notify_device_under_maintenance();


INSERT INTO
    EMPLOYEE (
        F_NAME,
        L_NAME,
        Birth_Date,
        SALARY,
        E_ROLE,
        E_PHOTO,
        E_ADDRESS,
        E_CITY,
        E_COUNTRY,
        E_ZIPCODE,
        E_USERNAME,
        E_PASSWORD,
        E_GENDER,
        E_ACTIVE
    )
VALUES
    (
        'Ahmed',
        'Fathy',
        '2004-04-19',
        10000,
        'Manager',
        '1.jpg',
        'Giza',
        'Giza',
        'Egypt',
        '12345',
        'ahmed',
        '$2b$10$OwzytpGyHBO1XYredXi1Wu2lWJ36oRCPL33S6cimYiYEEkDQcik5e',
        'male',
        true
    );
    INSERT INTO
    EMPLOYEE (
        F_NAME,
        L_NAME,
        Birth_Date,
        SALARY,
        E_ROLE,
        E_PHOTO,
        E_ADDRESS,
        E_CITY,
        E_COUNTRY,
        E_ZIPCODE,
        E_USERNAME,
        E_PASSWORD,
        E_GENDER,
        E_ACTIVE
    )
VALUES
    (
        'Nawal',
        'Hossam',
        '2004-04-19',
        10000,
        'Accountant',
        '2.jpg',
        'Giza',
        'Giza',
        'Egypt',
        '12345',
        'nawal',
        '$2b$10$OwzytpGyHBO1XYredXi1Wu2lWJ36oRCPL33S6cimYiYEEkDQcik5e',
        'male',
        true
    );
        INSERT INTO
    EMPLOYEE (
        F_NAME,
        L_NAME,
        Birth_Date,
        SALARY,
        E_ROLE,
        E_PHOTO,
        E_ADDRESS,
        E_CITY,
        E_COUNTRY,
        E_ZIPCODE,
        E_USERNAME,
        E_PASSWORD,
        E_GENDER,
        E_ACTIVE
    )
VALUES
    (
        'Mohamed',
        'Kamal',
        '2004-04-19',
        10000,
        'SalesMan',
        '3.jpg',
        'Giza',
        'Giza',
        'Egypt',
        '12345',
        'mohamed',
        '$2b$10$OwzytpGyHBO1XYredXi1Wu2lWJ36oRCPL33S6cimYiYEEkDQcik5e',
        'male',
        true
    );
        INSERT INTO
    EMPLOYEE (
        F_NAME,
        L_NAME,
        Birth_Date,
        SALARY,
        E_ROLE,
        E_PHOTO,
        E_ADDRESS,
        E_CITY,
        E_COUNTRY,
        E_ZIPCODE,
        E_USERNAME,
        E_PASSWORD,
        E_GENDER,
        E_ACTIVE
    )
VALUES
    (
        'Hager',
        'Abdel-Salam',
        '2004-04-19',
        10000,
        'Technical Support',
        '4.jpg',
        'Giza',
        'Giza',
        'Egypt',
        '12345',
        'hager',
        '$2b$10$OwzytpGyHBO1XYredXi1Wu2lWJ36oRCPL33S6cimYiYEEkDQcik5e',
        'male',
        true
    );
        INSERT INTO
    EMPLOYEE (
        F_NAME,
        L_NAME,
        Birth_Date,
        SALARY,
        E_ROLE,
        E_PHOTO,
        E_ADDRESS,
        E_CITY,
        E_COUNTRY,
        E_ZIPCODE,
        E_USERNAME,
        E_PASSWORD,
        E_GENDER,
        E_ACTIVE
    )
VALUES
    (
        'Amira',
        'Yasser',
        '2004-04-19',
        10000,
        'Secartary',
        '5.jpg',
        'Giza',
        'Giza',
        'Egypt',
        '12345',
        'amira',
        '$2b$10$OwzytpGyHBO1XYredXi1Wu2lWJ36oRCPL33S6cimYiYEEkDQcik5e',
        'male',
        true
    );


    -- 1. Manager: Full access to all pages and actions
INSERT INTO ACCESS_Actions (
    E_ID, 
    users_page, users_add, users_edit, users_delete, users_view,
    products_page, products_add, products_edit, products_delete, products_view,
    repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
    sales_page, sales_add, sales_edit, sales_delete, sales_view,
    price_page, price_add, price_edit, price_delete, price_view,
    debts_page, debts_add, debts_edit, debts_delete, debts_view,
    purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
    customer_page, customer_add, customer_edit, customer_delete, customer_view,
    supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
) VALUES (
    1, -- Manager ID
    True, True, True, True, True, 
    True, True, True, True, True, 
    True, True, True, True, True, True, 
    True, True, True, True, True, 
    True, True, True, True, True, 
    True, True, True, True, True, 
    True, True, True, True, True, 
    True, True, True, True, True, 
    True, True, True, True, True  
);

-- 2. Technical Support: Limited access to repair and products
INSERT INTO ACCESS_Actions (
    E_ID,
    users_page, users_add, users_edit, users_delete, users_view,
    products_page, products_add, products_edit, products_delete, products_view,
    repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
    sales_page, sales_add, sales_edit, sales_delete, sales_view,
    price_page, price_add, price_edit, price_delete, price_view,
    debts_page, debts_add, debts_edit, debts_delete, debts_view,
    purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
    customer_page, customer_add, customer_edit, customer_delete, customer_view,
    supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
) VALUES (
    2, 
    False, False, False, False, False, 
    True, True, True, False, True, 
    True, True, True, False, True, True, 
    False, False, False, False, False, 
    False, False, False, False, False, 
    False, False, False, False, False, 
    False, False, False, False, False, 
    False, False, False, False, False, 
    False, False, False, False, False  
);

-- 3. salesman: Limited access to sales and customers
INSERT INTO ACCESS_Actions (
    E_ID,
    users_page, users_add, users_edit, users_delete, users_view,
    products_page, products_add, products_edit, products_delete, products_view,
    repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
    sales_page, sales_add, sales_edit, sales_delete, sales_view,
    price_page, price_add, price_edit, price_delete, price_view,
    debts_page, debts_add, debts_edit, debts_delete, debts_view,
    purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
    customer_page, customer_add, customer_edit, customer_delete, customer_view,
    supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
) VALUES (
    3, -- salesman ID
    False, False, False, False, False, 
    False, False, False, False, False, 
    False, False, False, False, False, False, 
    True, True, True, False, True, 
    True, True, True, False, True, 
    True, True, True, False, True, 
    False, False, False, False, False, 
    True, True, True, False, True, 
    False, False, False, False, False  
);

-- 4. Accountant: Limited access to purchases, sales, and supplier management
INSERT INTO ACCESS_Actions (
    E_ID,
    users_page, users_add, users_edit, users_delete, users_view,
    products_page, products_add, products_edit, products_delete, products_view,
    repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
    sales_page, sales_add, sales_edit, sales_delete, sales_view,
    price_page, price_add, price_edit, price_delete, price_view,
    debts_page, debts_add, debts_edit, debts_delete, debts_view,
    purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
    customer_page, customer_add, customer_edit, customer_delete, customer_view,
    supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
) VALUES (
    4, 
    False, False, False, False, False, 
    False, False, False, False, False, 
    False, False, False, False, False, False, 
    True, False, True, False, True, 
    True, True, True, False, True, 
    True, True, True, False, True, 
    True, True, True, False, True, 
    False, False, False, False, False, 
    True, True, True, False, True  
);

-- 5. Secretary: View-only access to most pages
INSERT INTO ACCESS_Actions (
   E_ID,
    users_page, users_add, users_edit, users_delete, users_view,
    products_page, products_add, products_edit, products_delete, products_view,
    repaire_page, repaire_add, repaire_edit, repaire_delete, repaire_view, repaire_adddum,
    sales_page, sales_add, sales_edit, sales_delete, sales_view,
    price_page, price_add, price_edit, price_delete, price_view,
    debts_page, debts_add, debts_edit, debts_delete, debts_view,
    purchase_page, purchase_add, purchase_edit, purchase_delete, purchase_view,
    customer_page, customer_add, customer_edit, customer_delete, customer_view,
    supplier_page, supplier_add, supplier_edit, supplier_delete, supplier_view
) VALUES (
    5, 
    True, False, False, False, True, 
    True, False, False, False, True, 
    True, False, False, False, True, False, 
    True, False, False, False, True, 
    True, False, False, False, True, 
    True, False, False, False, True, 
    True, False, False, False, True, 
    True, False, False, False, True, 
    True, False, False, False, True  
);
