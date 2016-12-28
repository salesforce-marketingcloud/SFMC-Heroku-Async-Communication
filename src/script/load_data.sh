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
_Purl=${DATABASE_URL}
_Purl="${3:-$_Purl}"

_TableName="schema_name.import_table"
_TableFields="id, value1"

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

	psql $_Purl <<EOF
	\copy $_TableName ($_TableFields) FROM './$_FileName' WITH csv HEADER DELIMITER AS ',';
EOF

	echo  "*** FINISHED 'load_data' script - $( date +"%G-%m-%d_%H:%M:%S" ) ***"

	# Exit successfully
	exit 0
fi
