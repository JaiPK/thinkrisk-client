const Accounting_Doc = 'Accounting Doc Id';
const Transaction ='Fin Doc Line Item Text';
const Document_Type_Id = 'Document Type Id';
const Document_Type_Description= 'Document Type Description';
const Line_Amt_LOC = 'Line Amt LOC';
const Parking_Username = 'Parking Username';
const Username = 'Username';
const Gl_Account_ID = 'Gl Account ID';
const GL_Account_Name = 'GL Account Name';
const Company_Code_Id = 'Company Code Id';
const Posting_Location = 'Posting Location';
const Entered_Location = 'Entered Location';
const Posting_Date = 'Posting Date';
const Line_Item_Id_PK = 'Line Item Id - PK';
const Line_Debit_Amt_LOC = 'Line Debit Amt LOC';
const Line_Credit_Amt_LOC = 'Line Credit Amt LOC';
const Debit_Credit_Flag = 'Debit Credit Flag';
const Entry_Date = 'Entry Date';
const Entry_Time = 'Entry Time';
const Manual_Entry = 'Manual Entry';
const ini=`[MODE]

KEY = GL
EXIS_UNIQ_IDEN = FALSE
MANUAL_ENTRY = TRUE


[INPUTFILE]
NAME = gl_2022_100.csv
;NAME = gl_2022_100_incorrect.csv

[MAPPING]
ACCOUNTING_DOC = ACCOUNTING_DOC,${Accounting_Doc}
TRANSACTION_DESCRIPTION = TRANSACTION_DESCRIPTION,${Transaction}
DOC_TYPE =  DOC_TYPE,${Document_Type_Id}
DOC_TYPE_DESCRIPTION = DOC_TYPE_DESCRIPTION,${Document_Type_Description}
AMOUNT = AMOUNT,${Line_Amt_LOC}
ENTERED_BY = ENTERED_BY,${Parking_Username}
POSTED_BY = POSTED_BY,${Username}
SAP_ACCOUNT = SAP_ACCOUNT,${Gl_Account_ID}
ACCOUNT_DESCRIPTION = ACCOUNT_DESCRIPTION,${GL_Account_Name}
SAP_COMPANY = SAP_COMPANY,${Company_Code_Id}
POSTED_LOCATION = POSTED_LOCATION,${Posting_Location}
ENTERED_LOCATION = ENTERED_LOCATION,${Entered_Location}
POSTING_DATE = POSTING_DATE,${Posting_Date}
LINE_ITEM_IDENTIFIER = LINE_ITEM_IDENTIFIER,${Line_Item_Id_PK}
DEBIT_AMOUNT = DEBIT_AMOUNT,${Line_Debit_Amt_LOC}
CREDIT_AMOUNT = CREDIT_AMOUNT,${Line_Credit_Amt_LOC}
DEBIT_CREDIT_FLAG = DEBIT_CREDIT_FLAG,${Debit_Credit_Flag}
ENTRY_DATE = ENTRY_DATE,${Entry_Date}
ENTRY_TIME = ENTRY_TIME,${Entry_Time}
MANUAL_ENTRY = MANUAL_ENTRY,${Manual_Entry}

[GL_CHECK]
NULL_CHECK = ACCOUNTING_DOC,LINE_ITEM_IDENTIFIER,DOC_TYPE,DEBIT_AMOUNT,CREDIT_AMOUNT,DEBIT_CREDIT_FLAG,AMOUNT,ENTRY_DATE,ENTRY_TIME,ENTERED_BY,SAP_ACCOUNT,POSTING_DATE,POSTED_BY,SAP_COMPANY,POSTED_LOCATION,ENTERED_LOCATION
UNIQ_IDEN  = ACCOUNTING_DOC
NEW_UNIQ_IDEN = ACCOUNTING_DOC,LINE_ITEM_IDENTIFIER
DEBIT_CREDIT_BALANCE_CHECK = DEBIT_AMOUNT,CREDIT_AMOUNT,ACCOUNTING_DOC
MANUAL_ENTRY_COL = MANUAL_ENTRY
MANUAL_ENTRY_GRPBY = ACCOUNTING_DOC
DATE_CHECK = POSTING_DATE
TIME_CHECK = ENTRY_TIME
ENTRY_DATE_CHECK= ENTRY_DATE
DEBIT_CRED_INDIC_COL = DEBIT_CREDIT_FLAG
AMOUNT_COL = AMOUNT
DEBIT_COL = DEBIT_AMOUNT
CREDIT_COL = CREDIT_AMOUNT
DEBIT_FLAGS = S,D
CREDIT_FLAGS = H,C


[AP_CHECK]
NULL_CHECK= Transaction date,Transaction type,Transaction number,Vendor name, Due date,Amount,Open balance,AccountPaid status, Class,Location,Transaction ID,Line Item Identifier,Amount,Debit Amount,Credit Amount,Invoice Date,Payment Date,Payment Terms,Accounting Doc Id
UNIQ_IDEN  = Line Item Identifier
NEW_UNIQ_IDEN = Transaction ID,Line Item Identifier
DEBIT_CREDIT_BALANCE_CHECK = Debit Amount,Credit Amount,Transaction ID
DATE_CHECK= Invoice_Date,Transaction date,Due date
DUE_DATE_CHECK = Due date
DUE_DATE_COLS = Invoice Date,Payment Terms`;

export default ini;