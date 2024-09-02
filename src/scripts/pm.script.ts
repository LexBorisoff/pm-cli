const sh = `#!/usr/bin/env bash

pm() {
	if command -v lexjs_pm &>/dev/null; then
		lexjs_pm "$@"

		# get package manager and script values
		local script_dir="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
		local parent_dir="$(dirname "$script_dir")"
		local cmd_file="$parent_dir/tmp/cmd"

		if [ -f "$cmd_file" ]; then
			local cmd=$(<"$cmd_file")

			# clear temp files
			>"$cmd_file"

			# run the script
			if [ ! -z "$cmd" ]; then
				$cmd
			fi
		fi
	fi
}
`;

// TODO: create pm.ps1 script
const ps1 = ``;

export const pm = { sh, ps1 };
