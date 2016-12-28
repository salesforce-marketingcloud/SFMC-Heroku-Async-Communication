#!/usr/bin/env bash
# Responsible for exporting data from the schema_name.export_table1 table into
# a csv file.
#
# Given a path to store the csv, copy data from the schema_name.export_table1 table
# into a csv file.

# ARGUMENTS
_FilePath="$1"

# VARIABLES
_Purl=${DATABASE_URL}
_Purl="${2:-$_Purl}"
_SQL="SELECT * from schema_name.export_table1 as t"

# EXECUTION
if [ -z "$_FilePath" ]
then
	echo "_FilePath is not set"
	exit 1
else
	echo  "*** STARTED 'export_data' script - $( date +"%G-%m-%d_%H:%M:%S" ) ***"

	psql $_Purl <<EOF
	\copy ($_SQL) TO '$_FilePath' WITH csv HEADER DELIMITER AS ',';
EOF

	echo  "*** FINISHED 'export_data' script - $( date +"%G-%m-%d_%H:%M:%S" ) ***"

	# Exit successfully
	exit 0
fi
