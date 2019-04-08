<script type="text/ng-template" id="edit-label.html">
    <div class="edit-label">
        <span ng-if="$ctrl.mode === 'View' || $ctrl.mode === 'Updating'" ng-class="['viewer', {updating: $ctrl.mode === 'Updating'}]" ng-click="$ctrl.onEdit()">
            <span class="view-label">{{ $ctrl.value }}</span>
            <span class="overlay-edit-icon fa fa-pencil"></span>
            <i class="overlay-spinner fa fa-spinner fa-spin"></i>
        </span>
        <div ng-if="$ctrl.mode === 'Edit'" class="editor" >
            <input type="text" ng-model="$ctrl.value" />
            <div class="save-options">
                <button type="submit" class="submit" ng-click="$ctrl.onUpdate()"><i class="fa fa-check"></i></button>
                <button type="cancel" class="cancel" ng-click="$ctrl.cancelEdit()"><i class="fa fa-times"></i></button>
            </div>
        </div>
    </div>
</script>