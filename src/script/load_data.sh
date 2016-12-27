#!/usr/bin/env bash
# Responsible for loading data into the schema_name.table2 table.
#
# Given a path and a file name, unzips the file and copies its contents into
# the schema_name.table2 table.

# ARGUMENTS
_SFTP_PATH="$1"
_FileNameZip="$2"

# VARIABLES
_FileName=$(echo $_FileNameZip | sed -e "s/\.zip/\.csv/g" )
_OldTableName="import_table_old"
_Purl=${DATABASE_URL}
_Schema="schema_name"
_TableFields="id, value1"
_TableName="import_table"
_Today=$(date +"%m_%d_%Y__%H_%M_%S")

_TempTableName="$_Schema.import_table_temp_$_Today"

# EXECUTION
if [ -z "$_FileName" ]
then
	echo "_FileName is not set"
	exit 1
else
	echo  "*** STARTED 'load_data' script - $( date +"%G-%m-%d_%H:%M:%S" ) ***"

	echo  "*** UNZIPPING '$_FileNameZip' STARTED - $( date +"%G-%m-%d_%H:%M:%S" ) ***"
	unzip -o -d $_SFTP_PATH $_SFTP_PATH/$_FileNameZip
	echo  "*** UNZIPPING '$_FileNameZip' FINISHED - $( date +"%G-%m-%d_%H:%M:%S" ) ***"

	if [ ! -f ./$_FileName ]
	then
		echo "Unzipped file cannot be found"
		exit 2
	fi

	# Runs through the following commands sequentially using a shell here-document
	# If we import big data then good practice is to load data into temporary table first
	psql $_Purl <<EOF
	CREATE TABLE $_TempTableName(
		id VARCHAR(50) NOT NULL,
		value1 INTEGER NOT NULL,
		CONSTRAINT import_table_id_value1_pk_$_Today PRIMARY KEY (id)
	);
	\copy $_TempTableName ($_TableFields) FROM './$_FileName' WITH csv HEADER DELIMITER AS ',';
	ALTER TABLE $_Schema.$_TableName RENAME TO $_OldTableName;
	ALTER TABLE $_TempTableName RENAME TO $_TableName;
	DROP TABLE $_Schema.$_OldTableName;
EOF

	echo  "*** FINISHED 'load_data' script - $( date +"%G-%m-%d_%H:%M:%S" ) ***"

	# Exit successfully
	exit 0
fi
