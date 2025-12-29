#!/bin/bash

envMerge() { eval "echo \"$(sed 's/"/\\"/g')\""; }

set -a
source $1

if [[ -n "$4" && -f "$4" ]]; then
  source "$4"
fi

if [[ -n "$5" && -f "$5" ]]; then
  source "$5"
fi

set +a

envMerge < $2 > $3