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
    Users_Page BOOLEAN DEFAULT False,
    Users_ADD BOOLEAN DEFAULT False,
    Users_EDIT BOOLEAN DEFAULT False,
    Users_DELETE BOOLEAN DEFAULT False,
    Users_VIEW BOOLEAN DEFAULT False,

    Products_Page BOOLEAN DEFAULT False,
    Products_ADD BOOLEAN DEFAULT False,
    Products_EDIT BOOLEAN DEFAULT False,
    Products_DELETE BOOLEAN DEFAULT False,
    Products_VIEW BOOLEAN DEFAULT False,

    Repaire_Page BOOLEAN DEFAULT False,
    Repaire_ADD BOOLEAN DEFAULT False,
    Repaire_EDIT BOOLEAN DEFAULT False,
    Repaire_DELETE BOOLEAN DEFAULT False,
    Repaire_VIEW BOOLEAN DEFAULT False,
    Repaire_ADDDUM BOOLEAN DEFAULT False,

    Sales_Page BOOLEAN DEFAULT False,
    Sales_ADD BOOLEAN DEFAULT False,
    Sales_EDIT BOOLEAN DEFAULT False,
    Sales_DELETE BOOLEAN DEFAULT False,
    Sales_VIEW BOOLEAN DEFAULT False,

    Price_Page BOOLEAN DEFAULT False,
    Price_ADD BOOLEAN DEFAULT False,
    Price_EDIT BOOLEAN DEFAULT False,
    Price_DELETE BOOLEAN DEFAULT False,
    Price_VIEW BOOLEAN DEFAULT False,

    Debts_Page BOOLEAN DEFAULT False,
    Debts_ADD BOOLEAN DEFAULT False,
    Debts_EDIT BOOLEAN DEFAULT False,
    Debts_DELETE BOOLEAN DEFAULT False,
    Debts_VIEW BOOLEAN DEFAULT False,

    Purchase_Page BOOLEAN DEFAULT False,
    Purchase_ADD BOOLEAN DEFAULT False,
    Purchase_EDIT BOOLEAN DEFAULT False,
    Purchase_DELETE BOOLEAN DEFAULT False,
    Purchase_VIEW BOOLEAN DEFAULT False,

    Customer_Page BOOLEAN DEFAULT False,
    Customer_ADD BOOLEAN DEFAULT False,
    Customer_EDIT BOOLEAN DEFAULT False,
    Customer_DELETE BOOLEAN DEFAULT False,
    Customer_VIEW BOOLEAN DEFAULT False,

    Supplier_Page BOOLEAN DEFAULT False,
    Supplier_ADD BOOLEAN DEFAULT False,
    Supplier_EDIT BOOLEAN DEFAULT False,
    Supplier_DELETE BOOLEAN DEFAULT False,
    Supplier_VIEW BOOLEAN DEFAULT False,

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
        FOREIGN KEY (C_ID) REFERENCES CUSTOMER (C_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    );

CREATE TABLE
    REPORT (
        RPT_ID SERIAL PRIMARY KEY,
        RP_TYPE VARCHAR(50) /*thats for the type of the report*/
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
        N_MESSAGE VARCHAR(100),
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
    -- Add a single notification to the NOTIFICATION table
    INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS, P_ID)
    VALUES (
        CURRENT_DATE,
        'Product Expiry',
        'Product ' || NEW.P_NAME || ' is nearing expiry!',
        'Pending',
        NEW.P_ID
    )
    RETURNING N_ID INTO notification_id;

    -- Get all Manager and Secretary employees
    SELECT ARRAY_AGG(E_ID) INTO manager_secretary_ids
    FROM EMPLOYEE
    WHERE E_ROLE IN ('Manager', 'Secretary');

    -- Link the notification to each relevant employee in NOTIFICATION_EMPLOYEE
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
    -- Add a single notification to the NOTIFICATION table
    INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS, D_ID)
    VALUES (
        CURRENT_DATE,
        'Debt Due Date',
        'Debt with ID ' || NEW.D_ID || ' is nearing its due date!',
        'Pending',
        NEW.D_ID
    )
    RETURNING N_ID INTO notification_id;

    -- Get all Manager and Accountant employees
    SELECT ARRAY_AGG(E_ID) INTO manager_accountant_ids
    FROM EMPLOYEE
    WHERE E_ROLE IN ('Manager', 'Accountant');

    -- Link the notification to each relevant employee in NOTIFICATION_EMPLOYEE
    FOREACH emp_id IN ARRAY manager_accountant_ids LOOP
        INSERT INTO NOTIFICATION_EMPLOYEE (N_ID, E_ID)
        VALUES (notification_id, emp_id);
    END LOOP;

    RETURN NEW;
END;
 $$ LANGUAGE plpgsql;

-- Trigger for checking due debts

CREATE TRIGGER debt_due_notification AFTER
INSERT
OR
UPDATE ON DEBTS
FOR EACH ROW WHEN (NEW.D_DATE IS NOT NULL
                   AND NEW.D_DATE <= CURRENT_DATE + INTERVAL '7 days') EXECUTE FUNCTION notify_due_debts();

-- Trigger for checking expire dates

CREATE TRIGGER product_expiry_notification AFTER
INSERT
OR
UPDATE ON STOCK
FOR EACH ROW WHEN (NEW.EXPIRE_DATE IS NOT NULL
                   AND NEW.EXPIRE_DATE <= CURRENT_DATE + INTERVAL '7 days') EXECUTE FUNCTION notify_expiring_products();

-- Create the function to send notifications for devices under maintenance
CREATE OR REPLACE FUNCTION notify_device_under_maintenance() RETURNS TRIGGER AS $$
DECLARE
    manager_technical_ids INT[];
    emp_id INT;
    notification_id INT;
BEGIN
    -- Check if the category is 'Device Under Maintenance'
    IF NEW.P_CATEGORY = 'Device Under Maintenance' THEN
        -- Add a notification to the NOTIFICATION table
        INSERT INTO NOTIFICATION (N_DATE, N_TYPE, N_MESSAGE, N_STATUS, P_ID)
        VALUES (
            CURRENT_DATE,
            'Device Maintenance Required',
            'A new device, "' || NEW.P_NAME || '", has been added for maintenance. Immediate attention is needed to address its issues.',
            'Pending',
            NEW.P_ID
        )
        RETURNING N_ID INTO notification_id;

        -- Get all Manager and Technical Support employees
        SELECT ARRAY_AGG(E_ID) INTO manager_technical_ids
        FROM EMPLOYEE
        WHERE E_ROLE IN ('Manager', 'Technical Support');

        -- Link the notification to each relevant employee in NOTIFICATION_EMPLOYEE
        FOREACH emp_id IN ARRAY manager_technical_ids LOOP
            INSERT INTO NOTIFICATION_EMPLOYEE (N_ID, E_ID)
            VALUES (notification_id, emp_id);
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for tracking devices under maintenance
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
        'ahmed.jpg',
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
    CUSTOMER (
        C_NAME,
        C_ADDRESS,
        C_CITY,
        C_COUNTRY,
        C_ZIPCODE,
        C_FAX,
        C_PHONE
    )
VALUES
    (
        'Customer A',
        '123 Main St',
        'New York',
        'USA',
        '10001',
        '123-456-7890',
        '123-456-7890'
    ),
    (
        'Customer B',
        '456 Elm St',
        'Los Angeles',
        'USA',
        '90001',
        '987-654-3210',
        '987-654-3210'
    ),
    (
        'Customer C',
        '789 Oak St',
        'Chicago',
        'USA',
        '60001',
        '456-789-0123',
        '456-789-0123'
    );

INSERT INTO
    SALES (
        SL_DATE,
        SL_TOTAL,
        SL_DISCOUNT,
        SL_TAX,
        SL_STATUS,
        SL_TYPE,
        SL_INAMOUNT,
        SL_COST,
        SL_BILLNUM,
        SL_PAYED,
        SL_CURRENCY,
        C_ID
    )
VALUES
    (
        '2024-11-01',
        345.00,
        10.00,
        25.00,
        'Completed',
        'SELLITEMS',
        475.00,
        300.00,
        1001,
        345.00,
        'USD',
        1
    ),
    (
        '2024-11-02',
        852.00,
        8.00,
        50.00,
        'Pending',
        'SELLITEMS',
        850.00,
        600.00,
        1002,
        852.00,
        'EUR',
        2
    ),
    (
        '2024-11-03',
        500.00,
        12.00,
        37.00,
        'Completed',
        'SELLITEMS',
        638.00,
        400.00,
        1003,
        500.00,
        'EGP',
        3
    ),
    (
        '2024-11-04',
        1160.00,
        15.00,
        60.00,
        'Cancelled',
        'REPAIR',
        1020.00,
        800.00,
        1004,
        1160.00,
        'USD',
        1
    ),
    (
        '2024-11-05',
        402.50,
        5.00,
        20.00,
        'Completed',
        'SERVICE',
        550.00,
        350.00,
        1005,
        402.50,
        'CAD',
        1
    );

INSERT INTO
    STOCK (
        P_NAME,
        P_COSTPRICE,
        P_SELLPRICE,
        P_QUANTITY,
        P_PHOTO,
        P_DESCRIPTION,
        P_CATEGORY,
        MODEL_CODE,
        EXPIRE_DATE,
        P_STATUS
    )
VALUES
    (
        'Product 1',
        15.50,
        25.75,
        100,
        'product1.jpg',
        'This is a description of Product 1. It has a long and detailed description.',
        'Category A',
        'AB123',
        '2025-12-31',
        'Available'
    ),
    (
        'Product 2',
        20.30,
        30.00,
        200,
        'product2.jpg',
        'Product 2 description goes here. It might be a bit longer than 100 characters.',
        'Category B',
        'BC234',
        '2026-01-15',
        'Available'
    );

INSERT INTO
    SUPPLIER (
        S_NAME,
        S_ADDRESS,
        S_CITY,
        S_COUNTRY,
        S_ZIPCODE,
        S_FAX,
        S_PHONE,
        S_EMAIL,
        S_PHOTO
    )
VALUES
    (
        'Supplier A',
        '123 Main St',
        'New York',
        'USA',
        '10001',
        '123-456-7890',
        '123-456-7890',
        'supplierA@example.com',
        'photoA.jpg'
    ),
    (
        'Supplier B',
        '456 Elm St',
        'Los Angeles',
        'USA',
        '90001',
        '987-654-3210',
        '987-654-3210',
        'supplierB@example.com',
        'photoB.jpg'
    );

INSERT INTO
    PURCHASE (
        PCH_DATE,
        PCH_TOTAL,
        PCH_TAX,
        PCH_COST,
        PCH_BILLNUM,
        PCH_CURRENCY,
        PCH_EXPENSE,
        PCH_CUSTOMSCOST,
        PCH_CUSTOMSNUM,
        S_ID
    )
VALUES
    (
        '2024-01-01',
        1000,
        100,
        900,
        12345,
        'USD',
        50,
        200,
        54321,
        1
    ),
    (
        '2024-01-15',
        1500,
        150,
        1350,
        12346,
        'USD',
        60,
        300,
        54322,
        2
    );

INSERT INTO
    PURCHASE_ITEMS (P_ID, PCH_ID, PI_QUANTITY, P_CATEGORY, PI_TOTAL)
VALUES
    (1, 1, 10, 'Category A', 500),
    (2, 1, 5, 'Category B', 500);

INSERT INTO
    PURCHASE_ITEMS (P_ID, PCH_ID, PI_QUANTITY, P_CATEGORY, PI_TOTAL)
VALUES
    (1, 2, 15, 'Category A', 750),
    (2, 2, 10, 'Category B', 750);


--     -- 1. Manager: Full access to all pages and actions
-- INSERT INTO ACCESS_Actions (
--     E_ID, 
--     Users_Page, Users_ADD, Users_EDIT, Users_DELETE, Users_VIEW,
--     Products_Page, Products_ADD, Products_EDIT, Products_DELETE, Products_VIEW,
--     Repaire_Page, Repaire_ADD, Repaire_EDIT, Repaire_DELETE, Repaire_VIEW, Repaire_ADDDUM,
--     Sales_Page, Sales_ADD, Sales_EDIT, Sales_DELETE, Sales_VIEW,
--     Price_Page, Price_ADD, Price_EDIT, Price_DELETE, Price_VIEW,
--     Debts_Page, Debts_ADD, Debts_EDIT, Debts_DELETE, Debts_VIEW,
--     Purchase_Page, Purchase_ADD, Purchase_EDIT, Purchase_DELETE, Purchase_VIEW,
--     Customer_Page, Customer_ADD, Customer_EDIT, Customer_DELETE, Customer_VIEW,
--     Supplier_Page, Supplier_ADD, Supplier_EDIT, Supplier_DELETE, Supplier_VIEW
-- ) VALUES (
--     1, -- Manager ID
--     True, True, True, True, True, -- Users
--     True, True, True, True, True, -- Products
--     True, True, True, True, True, True, -- Repaire
--     True, True, True, True, True, -- Sales
--     True, True, True, True, True, -- Price
--     True, True, True, True, True, -- Debts
--     True, True, True, True, True, -- Purchase
--     True, True, True, True, True, -- Customer
--     True, True, True, True, True  -- Supplier
-- );

-- -- 2. Technical Support: Limited access to repair and products
-- INSERT INTO ACCESS_Actions (
--     E_ID,
--     Users_Page, Users_ADD, Users_EDIT, Users_DELETE, Users_VIEW,
--     Products_Page, Products_ADD, Products_EDIT, Products_DELETE, Products_VIEW,
--     Repaire_Page, Repaire_ADD, Repaire_EDIT, Repaire_DELETE, Repaire_VIEW, Repaire_ADDDUM,
--     Sales_Page, Sales_ADD, Sales_EDIT, Sales_DELETE, Sales_VIEW,
--     Price_Page, Price_ADD, Price_EDIT, Price_DELETE, Price_VIEW,
--     Debts_Page, Debts_ADD, Debts_EDIT, Debts_DELETE, Debts_VIEW,
--     Purchase_Page, Purchase_ADD, Purchase_EDIT, Purchase_DELETE, Purchase_VIEW,
--     Customer_Page, Customer_ADD, Customer_EDIT, Customer_DELETE, Customer_VIEW,
--     Supplier_Page, Supplier_ADD, Supplier_EDIT, Supplier_DELETE, Supplier_VIEW
-- ) VALUES (
--     2, -- Technical Support ID
--     False, False, False, False, False, -- Users
--     True, True, True, False, True, -- Products
--     True, True, True, False, True, True, -- Repaire
--     False, False, False, False, False, -- Sales
--     False, False, False, False, False, -- Price
--     False, False, False, False, False, -- Debts
--     False, False, False, False, False, -- Purchase
--     False, False, False, False, False, -- Customer
--     False, False, False, False, False  -- Supplier
-- );

-- -- 3. Salesman: Limited access to sales and customers
-- INSERT INTO ACCESS_Actions (
--     E_ID,
--     Users_Page, Users_ADD, Users_EDIT, Users_DELETE, Users_VIEW,
--     Products_Page, Products_ADD, Products_EDIT, Products_DELETE, Products_VIEW,
--     Repaire_Page, Repaire_ADD, Repaire_EDIT, Repaire_DELETE, Repaire_VIEW, Repaire_ADDDUM,
--     Sales_Page, Sales_ADD, Sales_EDIT, Sales_DELETE, Sales_VIEW,
--     Price_Page, Price_ADD, Price_EDIT, Price_DELETE, Price_VIEW,
--     Debts_Page, Debts_ADD, Debts_EDIT, Debts_DELETE, Debts_VIEW,
--     Purchase_Page, Purchase_ADD, Purchase_EDIT, Purchase_DELETE, Purchase_VIEW,
--     Customer_Page, Customer_ADD, Customer_EDIT, Customer_DELETE, Customer_VIEW,
--     Supplier_Page, Supplier_ADD, Supplier_EDIT, Supplier_DELETE, Supplier_VIEW
-- ) VALUES (
--     3, -- Salesman ID
--     False, False, False, False, False, -- Users
--     False, False, False, False, False, -- Products
--     False, False, False, False, False, False, -- Repaire
--     True, True, True, False, True, -- Sales
--     True, True, True, False, True, -- Price
--     True, True, True, False, True, -- Debts
--     False, False, False, False, False, -- Purchase
--     True, True, True, False, True, -- Customer
--     False, False, False, False, False  -- Supplier
-- );

-- -- 4. Accountant: Limited access to purchases, sales, and supplier management
-- INSERT INTO ACCESS_Actions (
--     E_ID,
--     Users_Page, Users_ADD, Users_EDIT, Users_DELETE, Users_VIEW,
--     Products_Page, Products_ADD, Products_EDIT, Products_DELETE, Products_VIEW,
--     Repaire_Page, Repaire_ADD, Repaire_EDIT, Repaire_DELETE, Repaire_VIEW, Repaire_ADDDUM,
--     Sales_Page, Sales_ADD, Sales_EDIT, Sales_DELETE, Sales_VIEW,
--     Price_Page, Price_ADD, Price_EDIT, Price_DELETE, Price_VIEW,
--     Debts_Page, Debts_ADD, Debts_EDIT, Debts_DELETE, Debts_VIEW,
--     Purchase_Page, Purchase_ADD, Purchase_EDIT, Purchase_DELETE, Purchase_VIEW,
--     Customer_Page, Customer_ADD, Customer_EDIT, Customer_DELETE, Customer_VIEW,
--     Supplier_Page, Supplier_ADD, Supplier_EDIT, Supplier_DELETE, Supplier_VIEW
-- ) VALUES (
--     4, -- Accountant ID
--     False, False, False, False, False, -- Users
--     False, False, False, False, False, -- Products
--     False, False, False, False, False, False, -- Repaire
--     True, False, True, False, True, -- Sales
--     True, True, True, False, True, -- Price
--     True, True, True, False, True, -- Debts
--     True, True, True, False, True, -- Purchase
--     False, False, False, False, False, -- Customer
--     True, True, True, False, True  -- Supplier
-- );

-- -- 5. Secretary: View-only access to most pages
-- INSERT INTO ACCESS_Actions (
--    E_ID,
--     Users_Page, Users_ADD, Users_EDIT, Users_DELETE, Users_VIEW,
--     Products_Page, Products_ADD, Products_EDIT, Products_DELETE, Products_VIEW,
--     Repaire_Page, Repaire_ADD, Repaire_EDIT, Repaire_DELETE, Repaire_VIEW, Repaire_ADDDUM,
--     Sales_Page, Sales_ADD, Sales_EDIT, Sales_DELETE, Sales_VIEW,
--     Price_Page, Price_ADD, Price_EDIT, Price_DELETE, Price_VIEW,
--     Debts_Page, Debts_ADD, Debts_EDIT, Debts_DELETE, Debts_VIEW,
--     Purchase_Page, Purchase_ADD, Purchase_EDIT, Purchase_DELETE, Purchase_VIEW,
--     Customer_Page, Customer_ADD, Customer_EDIT, Customer_DELETE, Customer_VIEW,
--     Supplier_Page, Supplier_ADD, Supplier_EDIT, Supplier_DELETE, Supplier_VIEW
-- ) VALUES (
--     5, -- Secretary ID
--     True, False, False, False, True, -- Users
--     True, False, False, False, True, -- Products
--     True, False, False, False, True, False, -- Repaire
--     True, False, False, False, True, -- Sales
--     True, False, False, False, True, -- Price
--     True, False, False, False, True, -- Debts
--     True, False, False, False, True, -- Purchase
--     True, False, False, False, True, -- Customer
--     True, False, False, False, True  -- Supplier
-- );
